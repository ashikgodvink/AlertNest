from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class IncidentStatus(str, Enum):
    reported = "reported"
    in_progress = "in_progress"
    resolved = "resolved"

class IncidentSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class IncidentCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str

class IncidentUpdate(BaseModel):
    status: Optional[IncidentStatus] = None
    assigned_to: Optional[str] = None

class CommentCreate(BaseModel):
    text: str

class CommentOut(BaseModel):
    id: str
    incident_id: str
    user_id: str
    user_name: str
    text: str
    created_at: str

class AttachmentOut(BaseModel):
    id: str
    incident_id: str
    filename: str
    file_url: str
    uploaded_by: str
    uploaded_at: str

class IncidentOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    location: str
    severity: str
    status: str
    reported_by: str
    assigned_to: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    comments: Optional[List[CommentOut]] = []
    attachments: Optional[List[AttachmentOut]] = []
