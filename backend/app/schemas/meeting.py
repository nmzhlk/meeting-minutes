import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.action_item import ActionItemResponse
from app.schemas.enums import MeetingStatus
from app.schemas.participant import ParticipantResponse


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
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    meeting_date: datetime
    duration_minutes: int = Field(default=30, ge=1, le=1440)
    status: MeetingStatus = MeetingStatus.SCHEDULED
    summary: str | None = None
    transcript: str | None = None
    audio_file_name: str | None = Field(default=None, max_length=255)


class MeetingCreate(MeetingBase):
    participant_ids: list[uuid.UUID] = Field(default_factory=list)
    agenda: list[str] = Field(default_factory=list)
    decisions: list[str] = Field(default_factory=list)


class MeetingUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    meeting_date: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=1, le=1440)
    status: MeetingStatus | None = None
    summary: str | None = None
    transcript: str | None = None
    audio_file_name: str | None = Field(default=None, max_length=255)
    participant_ids: list[uuid.UUID] | None = None
    agenda: list[str] | None = None
    decisions: list[str] | None = None


class MeetingResponse(MeetingBase):
    id: uuid.UUID
    created_at: datetime
    participants: list[ParticipantResponse] = Field(default_factory=list)
    agenda_items: list[AgendaItemResponse] = Field(default_factory=list)
    decisions: list[DecisionResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class MeetingDetailResponse(MeetingResponse):
    action_items: list[ActionItemResponse] = Field(default_factory=list)
