import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import ActionItemStatus, Priority
from app.schemas.participant import ParticipantResponse


class ActionItemBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    due_date: datetime | None = None
    status: ActionItemStatus = ActionItemStatus.TODO
    priority: Priority = Priority.MEDIUM


class ActionItemCreate(ActionItemBase):
    meeting_id: uuid.UUID
    assignee_id: uuid.UUID | None = None


class ActionItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    due_date: datetime | None = None
    status: ActionItemStatus | None = None
    priority: Priority | None = None
    assignee_id: uuid.UUID | None = None


class ActionItemStatusUpdate(BaseModel):
    status: ActionItemStatus


class ActionItemResponse(ActionItemBase):
    id: uuid.UUID
    meeting_id: uuid.UUID
    assignee_id: uuid.UUID | None = None
    created_at: datetime
    assignee: ParticipantResponse | None = None

    model_config = ConfigDict(from_attributes=True)
