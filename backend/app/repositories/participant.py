import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate, ParticipantUpdate


def get_participant(db: Session, participant_id: uuid.UUID) -> Participant | None:
    return db.scalar(select(Participant).where(Participant.id == participant_id))


def get_participant_by_email(db: Session, email: str) -> Participant | None:
    return db.scalar(select(Participant).where(Participant.email == email))


def get_participants_by_ids(
    db: Session, participant_ids: list[uuid.UUID]
) -> list[Participant]:
    if not participant_ids:
        return []
    query = select(Participant).where(Participant.id.in_(participant_ids))
    return list(db.scalars(query).all())


def get_participants(db: Session, skip: int = 0, limit: int = 100) -> list[Participant]:
    query = (
        select(Participant)
        .order_by(Participant.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(query).all())


def create_participant(db: Session, obj_in: ParticipantCreate) -> Participant:
    db_obj = Participant(
        name=obj_in.name,
        email=obj_in.email,
        role=obj_in.role,
        avatar_url=obj_in.avatar_url,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_participant(
    db: Session, db_obj: Participant, obj_in: ParticipantUpdate
) -> Participant:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_participant(db: Session, db_obj: Participant) -> Participant:
    db.delete(db_obj)
    db.commit()
    return db_obj
