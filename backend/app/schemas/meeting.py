import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.participant import ParticipantResponse
from app.schemas.action_item import ActionItemResponse

STATUS_REGEX = r"^(SCHEDULED|RECORDED|PROCESSED|COMPLETED)$"


class AgendaItemResponse(BaseModel):
    id: uuid.UUID
    item: str
    order_index: int

    model_config = ConfigDict(from_attributes=True)


class DecisionResponse(BaseModel):
    id: uuid.UUID
    decision: str
    order_index: int

    model_config = ConfigDict(from_attributes=True)


class MeetingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    meeting_date: datetime
    duration_minutes: int = Field(default=30, ge=1, le=1440)
    status: str = Field(default="SCHEDULED", pattern=STATUS_REGEX)
    summary: Optional[str] = None
    transcript: Optional[str] = None
    audio_file_name: Optional[str] = Field(None, max_length=255)


class MeetingCreate(MeetingBase):
    participant_ids: Optional[List[uuid.UUID]] = Field(default_factory=list)
    agenda: Optional[List[str]] = Field(default_factory=list)
    decisions: Optional[List[str]] = Field(default_factory=list)


class MeetingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=1, le=1440)
    status: Optional[str] = Field(None, pattern=STATUS_REGEX)
    summary: Optional[str] = None
    transcript: Optional[str] = None
    audio_file_name: Optional[str] = Field(None, max_length=255)
    participant_ids: Optional[List[uuid.UUID]] = None
    agenda: Optional[List[str]] = None
    decisions: Optional[List[str]] = None


class MeetingResponse(MeetingBase):
    id: uuid.UUID
    created_at: datetime
    participants: List[ParticipantResponse] = Field(default_factory=list)
    agenda_items: List[AgendaItemResponse] = Field(default_factory=list)
    decisions: List[DecisionResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class MeetingDetailResponse(MeetingResponse):
    action_items: List[ActionItemResponse] = Field(default_factory=list)
