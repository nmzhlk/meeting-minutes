import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.participant import ParticipantResponse

STATUS_REGEX = r"^(TODO|IN_PROGRESS|DONE)$"
PRIORITY_REGEX = r"^(LOW|MEDIUM|HIGH)$"


class ActionItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    due_date: Optional[datetime] = None
    status: str = Field(default="TODO", pattern=STATUS_REGEX)
    priority: str = Field(default="MEDIUM", pattern=PRIORITY_REGEX)


class ActionItemCreate(ActionItemBase):
    meeting_id: uuid.UUID
    assignee_id: Optional[uuid.UUID] = None


class ActionItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    due_date: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern=STATUS_REGEX)
    priority: Optional[str] = Field(None, pattern=PRIORITY_REGEX)
    assignee_id: Optional[uuid.UUID] = None


class ActionItemStatusUpdate(BaseModel):
    status: str = Field(..., pattern=STATUS_REGEX)


class ActionItemResponse(ActionItemBase):
    id: uuid.UUID
    meeting_id: uuid.UUID
    assignee_id: Optional[uuid.UUID] = None
    created_at: datetime
    assignee: Optional[ParticipantResponse] = None

    model_config = ConfigDict(from_attributes=True)
