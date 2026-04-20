from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

def compute_summary(incidents: list) -> dict:
    total       = len(incidents)
    reported    = sum(1 for i in incidents if i.get("status") == "reported")
    in_progress = sum(1 for i in incidents if i.get("status") == "in_progress")
    resolved    = sum(1 for i in incidents if i.get("status") == "resolved")
    high        = sum(1 for i in incidents if i.get("severity") == "high")
    medium      = sum(1 for i in incidents if i.get("severity") == "medium")
    low         = sum(1 for i in incidents if i.get("severity") == "low")
    return {
        "total": total,
        "reported": reported,
        "in_progress": in_progress,
        "resolved": resolved,
        "high": high,
        "medium": medium,
        "low": low,
        "resolution_rate": round((resolved / total * 100) if total > 0 else 0)
    }

@router.get("/summary")
async def get_summary(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    role = current_user.get("role", "student")
    uid  = current_user["uid"]
    incidents_collection = db.incidents

    if role == "admin":
        # admin sees everything
        incidents = list(incidents_collection.find({}))

    elif role == "staff":
        # staff sees own + assigned
        own      = list(incidents_collection.find({"reported_by": uid}))
        assigned = list(incidents_collection.find({"assigned_to": uid}))
        seen, incidents = set(), []
        for doc in own + assigned:
            doc_id = str(doc["_id"])
            if doc_id not in seen:
                seen.add(doc_id)
                incidents.append(doc)

    else:
        # student sees only their own
        incidents = list(incidents_collection.find({"reported_by": uid}))

    return compute_summary(incidents)

@router.get("/recent")
async def get_recent(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    role = current_user.get("role", "student")
    uid  = current_user["uid"]
    incidents_collection = db.incidents

    if role == "admin":
        # Fetch all
        all_docs = list(incidents_collection.find({}))

    elif role == "staff":
        own      = list(incidents_collection.find({"reported_by": uid}))
        assigned = list(incidents_collection.find({"assigned_to": uid}))
        seen, all_docs = set(), []
        for doc in own + assigned:
            doc_id = str(doc["_id"])
            if doc_id not in seen:
                seen.add(doc_id)
                all_docs.append(doc)

    else:
        all_docs = list(incidents_collection.find({"reported_by": uid}))

    # Sort by created_at descending
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
            "created_at": d.get("created_at"),
        } for d in recent]
    }
