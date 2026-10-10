import uuid
from typing import Any

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.action_item import ActionItem
from app.models.meeting import Meeting, MeetingAgendaItem, MeetingDecision
from app.repositories.participant import get_participants_by_ids
from app.schemas.meeting import MeetingCreate, MeetingUpdate


def _meeting_detail_options() -> tuple[Any, ...]:
    return (
        selectinload(Meeting.participants),
        selectinload(Meeting.agenda_items),
        selectinload(Meeting.decisions),
        selectinload(Meeting.action_items).joinedload(ActionItem.assignee),
    )


def _meeting_list_options() -> tuple[Any, ...]:
    return (
        selectinload(Meeting.participants),
        selectinload(Meeting.agenda_items),
        selectinload(Meeting.decisions),
    )


def get_meeting(db: Session, meeting_id: uuid.UUID) -> Meeting | None:
    query = (
        select(Meeting)
        .options(*_meeting_detail_options())
        .where(Meeting.id == meeting_id)
    )
    return db.scalar(query)


def get_meetings(
    db: Session,
    status: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Meeting]:
    query = (
        select(Meeting)
        .options(*_meeting_list_options())
        .order_by(Meeting.meeting_date.desc())
    )
    if status:
        status_val = status.value if hasattr(status, "value") else str(status)
        query = query.where(Meeting.status == status_val)
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Meeting.title.ilike(search_pattern),
                Meeting.description.ilike(search_pattern),
            )
        )
    query = query.offset(skip).limit(limit)
    return list(db.scalars(query).all())


def create_meeting(db: Session, obj_in: MeetingCreate) -> Meeting:
    db_obj = Meeting(
        title=obj_in.title,
        description=obj_in.description,
        meeting_date=obj_in.meeting_date,
        duration_minutes=obj_in.duration_minutes,
        status=obj_in.status.value
        if hasattr(obj_in.status, "value")
        else str(obj_in.status),
        summary=obj_in.summary,
        transcript=obj_in.transcript,
        audio_file_name=obj_in.audio_file_name,
    )

    if obj_in.participant_ids:
        db_obj.participants = get_participants_by_ids(db, obj_in.participant_ids)

    if obj_in.agenda:
        for idx, item_text in enumerate(obj_in.agenda):
            db_obj.agenda_items.append(
                MeetingAgendaItem(item=item_text, order_index=idx)
            )

    if obj_in.decisions:
        for idx, decision_text in enumerate(obj_in.decisions):
            db_obj.decisions.append(
                MeetingDecision(decision=decision_text, order_index=idx)
            )

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return get_meeting(db, db_obj.id) or db_obj


def update_meeting(db: Session, db_obj: Meeting, obj_in: MeetingUpdate) -> Meeting:
    scalar_fields = [
        "title",
        "description",
        "meeting_date",
        "duration_minutes",
        "summary",
        "transcript",
        "audio_file_name",
    ]
    for field in scalar_fields:
        val = getattr(obj_in, field)
        if val is not None:
            setattr(db_obj, field, val)

    if obj_in.status is not None:
        db_obj.status = (
            obj_in.status.value
            if hasattr(obj_in.status, "value")
            else str(obj_in.status)
        )

    if obj_in.participant_ids is not None:
        db_obj.participants = get_participants_by_ids(db, obj_in.participant_ids)

    if obj_in.agenda is not None:
        db_obj.agenda_items.clear()
        for idx, item_text in enumerate(obj_in.agenda):
            db_obj.agenda_items.append(
                MeetingAgendaItem(item=item_text, order_index=idx)
            )

    if obj_in.decisions is not None:
        db_obj.decisions.clear()
        for idx, decision_text in enumerate(obj_in.decisions):
            db_obj.decisions.append(
                MeetingDecision(decision=decision_text, order_index=idx)
            )

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return get_meeting(db, db_obj.id) or db_obj


def delete_meeting(db: Session, db_obj: Meeting) -> Meeting:
    db.delete(db_obj)
    db.commit()
    return db_obj
