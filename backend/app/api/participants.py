import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import DbSession
from app.repositories import participant as participant_repo
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantResponse,
    ParticipantUpdate,
)

router = APIRouter()


@router.get("", response_model=list[ParticipantResponse])
def list_participants(
    db: DbSession, skip: int = 0, limit: int = 100
) -> list[ParticipantResponse]:
    return [
        ParticipantResponse.model_validate(p)
        for p in participant_repo.get_participants(db, skip=skip, limit=limit)
    ]


@router.post(
    "", response_model=ParticipantResponse, status_code=status.HTTP_201_CREATED
)
def create_participant(
    db: DbSession, participant_in: ParticipantCreate
) -> ParticipantResponse:
    existing = participant_repo.get_participant_by_email(db, participant_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Participant with email '{participant_in.email}' already exists",
        )
    return ParticipantResponse.model_validate(
        participant_repo.create_participant(db, participant_in)
    )


@router.get("/{participant_id}", response_model=ParticipantResponse)
def get_participant(db: DbSession, participant_id: uuid.UUID) -> ParticipantResponse:
    participant = participant_repo.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Participant with id '{participant_id}' not found",
        )
    return ParticipantResponse.model_validate(participant)


@router.put("/{participant_id}", response_model=ParticipantResponse)
def update_participant(
    db: DbSession, participant_id: uuid.UUID, participant_in: ParticipantUpdate
) -> ParticipantResponse:
    participant = participant_repo.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Participant with id '{participant_id}' not found",
        )

    if participant_in.email and participant_in.email != participant.email:
        existing = participant_repo.get_participant_by_email(db, participant_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Participant with email '{participant_in.email}' already exists"
                ),
            )

    return ParticipantResponse.model_validate(
        participant_repo.update_participant(db, participant, participant_in)
    )


@router.delete("/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_participant(db: DbSession, participant_id: uuid.UUID) -> None:
    participant = participant_repo.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Participant with id '{participant_id}' not found",
        )
    participant_repo.delete_participant(db, participant)
    return None
