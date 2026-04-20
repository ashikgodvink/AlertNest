from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from app.database import get_db
from app.utils.auth import get_current_user
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

class IncidentCreate(BaseModel):
    title: str       = Field(..., max_length=120)
    description: str = Field(..., max_length=2000)
    category: str    = Field(..., max_length=60)
    location: str    = Field(..., max_length=120)

class StatusUpdate(BaseModel):
    status: str

class AssignUpdate(BaseModel):
    assigned_to: str

def classify_severity(description: str) -> str:
    desc = description.lower()
    high_keywords = [
        'fire', 'flood', 'emergency', 'critical', 'danger', 'urgent', 'injury',
        'attack', 'explosion', 'collapse', 'trapped', 'unconscious', 'bleeding',
        'smoke', 'gas leak', 'chemical', 'threat', 'violence', 'assault',
        'electrical fire', 'structural damage', 'evacuation', 'ambulance', 'police'
    ]
    medium_keywords = [
        'broken', 'damaged', 'leak', 'fault', 'issue', 'problem', 'failure',
        'not working', 'malfunction', 'crack', 'spill', 'blocked', 'stuck',
        'overheating', 'flooding', 'power outage', 'no power', 'no water',
        'vandalism', 'graffiti', 'missing', 'stolen', 'suspicious', 'noise',
        'smell', 'pest', 'mold', 'broken window', 'broken door', 'broken lock'
    ]
    if any(w in desc for w in high_keywords):
        return 'high'
    if any(w in desc for w in medium_keywords):
        return 'medium'
    return 'low'

@router.post("", status_code=201)
async def create_incident(data: IncidentCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    incidents_collection = db.incidents
    doc = {
        "title": data.title,
        "description": data.description,
        "category": data.category,
        "location": data.location,
        "severity": classify_severity(data.description),
        "status": "reported",
        "reported_by": current_user["uid"],
        "assigned_to": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = incidents_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return {"message": "Incident reported", "incident": doc}

@router.get("")
async def get_incidents(
    current_user: dict = Depends(get_current_user),
    status:   str = Query(None),
    severity: str = Query(None),
    category: str = Query(None),
):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    role = current_user.get("role", "student")
    uid = current_user["uid"]
    incidents_collection = db.incidents

    if role == "admin":
        incidents = list(incidents_collection.find({}))
    elif role == "staff":
        own      = list(incidents_collection.find({"reported_by": uid}))
        assigned = list(incidents_collection.find({"assigned_to": uid}))
        seen = set()
        incidents = []
        for doc in own + assigned:
            doc_id = str(doc["_id"])
            if doc_id not in seen:
                seen.add(doc_id)
                incidents.append(doc)
    else:
        incidents = list(incidents_collection.find({"reported_by": uid}))

    # Convert ObjectId to string and apply filters
    result = []
    for inc in incidents:
        inc["id"] = str(inc["_id"])
        del inc["_id"]
        
        if status and inc.get("status") != status:
            continue
        if severity and inc.get("severity") != severity:
            continue
        if category and inc.get("category", "").lower() != category.lower():
            continue
        result.append(inc)
    
    return {"incidents": result}

@router.get("/{incident_id}")
async def get_incident(incident_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    incidents_collection = db.incidents
    try:
        incident = incidents_collection.find_one({"_id": ObjectId(incident_id)})
    except:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident["id"] = str(incident["_id"])
    del incident["_id"]
    
    role = current_user.get("role", "student")
    if role != "admin" and incident["reported_by"] != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return {"incident": incident}

@router.put("/{incident_id}/assign")
async def assign_incident(incident_id: str, data: AssignUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    db = get_db()
    incidents_collection = db.incidents
    try:
        result = incidents_collection.update_one(
            {"_id": ObjectId(incident_id)},
            {"$set": {
                "assigned_to": data.assigned_to,
                "status": "in_progress",
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Incident not found")
    except:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Incident assigned"}

@router.put("/{incident_id}/status")
async def update_status(incident_id: str, data: StatusUpdate, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role", "student")
    db = get_db()
    incidents_collection = db.incidents
    try:
        incident = incidents_collection.find_one({"_id": ObjectId(incident_id)})
    except:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if role == "admin":
        pass
    elif role == "staff" and incident.get("assigned_to") == current_user["uid"]:
        pass
    else:
        raise HTTPException(status_code=403, detail="Not authorized to update this incident")
    
    if data.status not in ["reported", "in_progress", "resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    incidents_collection.update_one(
        {"_id": ObjectId(incident_id)},
        {"$set": {
            "status": data.status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }}
    )
    return {"message": "Status updated"}

@router.delete("/{incident_id}")
async def delete_incident(incident_id: str, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role", "student")
    db = get_db()
    incidents_collection = db.incidents
    try:
        incident = incidents_collection.find_one({"_id": ObjectId(incident_id)})
    except:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # admin can delete any; student can delete their own unreported ones
    if role == "admin":
        pass
    elif role == "student" and incident.get("reported_by") == current_user["uid"] and incident.get("status") == "reported":
        pass
    else:
        raise HTTPException(status_code=403, detail="Not authorized to delete this incident")
    
    incidents_collection.delete_one({"_id": ObjectId(incident_id)})
    return {"message": "Incident deleted"}
