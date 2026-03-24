from fastapi import APIRouter, Depends
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/summary")
async def get_summary(current_user: dict = Depends(get_current_user)):
    db = get_db()
    all_docs = db.collection("incidents").get()
    incidents = [d.to_dict() for d in all_docs]

    total = len(incidents)
    reported = sum(1 for i in incidents if i.get("status") == "reported")
    in_progress = sum(1 for i in incidents if i.get("status") == "in_progress")
    resolved = sum(1 for i in incidents if i.get("status") == "resolved")
    high = sum(1 for i in incidents if i.get("severity") == "high")
    medium = sum(1 for i in incidents if i.get("severity") == "medium")
    low = sum(1 for i in incidents if i.get("severity") == "low")

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

@router.get("/recent")
async def get_recent(current_user: dict = Depends(get_current_user)):
    db = get_db()
    docs = db.collection("incidents").limit(5).get()
    incidents = [{
        "id": d.id,
        "title": d.to_dict().get("title"),
        "category": d.to_dict().get("category"),
        "severity": d.to_dict().get("severity"),
        "status": d.to_dict().get("status"),
        "location": d.to_dict().get("location", ""),
    } for d in docs]
    return {"incidents": incidents}
