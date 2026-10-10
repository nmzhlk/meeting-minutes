import uuid
from fastapi import APIRouter, HTTPException, status
from app.api.dependencies import DbSession
from app.schemas.meeting import (
    MeetingCreate,
    MeetingUpdate,
    MeetingResponse,
    MeetingDetailResponse,
)
from app.repositories import meeting as meeting_repo
from app.repositories import participant as participant_repo

router = APIRouter()


@router.get("", response_model=list[MeetingResponse])
def list_meetings(
    db: DbSession,
    status: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    return meeting_repo.get_meetings(
        db, status=status, search=search, skip=skip, limit=limit
    )


@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(db: DbSession, meeting_in: MeetingCreate):
    if meeting_in.participant_ids:
        for p_id in meeting_in.participant_ids:
            if not participant_repo.get_participant(db, p_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Participant with id '{p_id}' not found",
                )
    return meeting_repo.create_meeting(db, meeting_in)


@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
def get_meeting(db: DbSession, meeting_id: uuid.UUID):
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )
    return meeting


@router.put("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    db: DbSession, meeting_id: uuid.UUID, meeting_in: MeetingUpdate
):
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )

    if meeting_in.participant_ids is not None:
        for p_id in meeting_in.participant_ids:
            if not participant_repo.get_participant(db, p_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Participant with id '{p_id}' not found",
                )

    return meeting_repo.update_meeting(db, meeting, meeting_in)


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(db: DbSession, meeting_id: uuid.UUID):
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )
    meeting_repo.delete_meeting(db, meeting)
    return None
