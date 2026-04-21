from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

def compute_summary(incidents: list) -> dict:
    total       = len(incidents)
    reported    = sum(1 for i in incidents if i.get("status") == "reported")
    in_progress = sum(1 for i in incidents if i.get("status") == "in_progress")
    resolved    = sum(1 for i in incidents if i.get("status") == "resolved")
    return {
        "total": total,
        "reported": reported,
        "in_progress": in_progress,
        "resolved": resolved,
        "resolution_rate": round((resolved / total * 100) if total > 0 else 0)
    }

def is_assigned_to(incident: dict, uid: str) -> bool:
    """Check if uid is in assigned_to (handles both string and array)"""
    at = incident.get("assigned_to")
    if not at:
        return False
    if isinstance(at, list):
        return uid in at
    return at == uid

def get_staff_incidents(incidents_collection, uid: str) -> list:
    own      = list(incidents_collection.find({"reported_by": uid}))
    assigned = list(incidents_collection.find({"assigned_to": uid}))  # MongoDB matches uid in array too
    seen, result = set(), []
    for doc in own + assigned:
        key = str(doc["_id"])
        if key not in seen:
            seen.add(key)
            result.append(doc)
    return result

@router.get("/summary")
async def get_summary(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    role = current_user.get("role", "student")
    uid  = current_user["uid"]

    if role == "admin":
        incidents = list(db.incidents.find({}))
    elif role == "staff":
        incidents = get_staff_incidents(db.incidents, uid)
    else:
        incidents = list(db.incidents.find({"reported_by": uid}))

    return compute_summary(incidents)

@router.get("/recent")
async def get_recent(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    role = current_user.get("role", "student")
    uid  = current_user["uid"]

    if role == "admin":
        all_docs = list(db.incidents.find({}))
    elif role == "staff":
        all_docs = get_staff_incidents(db.incidents, uid)
    else:
        all_docs = list(db.incidents.find({"reported_by": uid}))

    all_docs.sort(key=lambda d: d.get("created_at", ""), reverse=True)
    recent = all_docs[:5]

    return {
        "incidents": [{
            "id": str(d["_id"]),
            "title": d.get("title"),
            "category": d.get("category"),
            "severity": d.get("severity"),
            "status": d.get("status"),
            "location": d.get("location", ""),
            "assigned_to": d.get("assigned_to"),
            "created_at": d.get("created_at"),
        } for d in recent]
    }
