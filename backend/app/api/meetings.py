import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DbSession
from app.repositories import meeting as meeting_repo
from app.repositories import user as user_repo
from app.schemas.enums import MeetingStatus
from app.schemas.meeting import (
    MeetingCreate,
    MeetingResponse,
    MeetingUpdate,
)

router = APIRouter()


def _validate_participants_exist(
    db: DbSession, participant_ids: list[uuid.UUID]
) -> None:
    if not participant_ids:
        return
    existing = user_repo.get_users_by_ids(db, participant_ids)
    existing_ids = {p.id for p in existing}
    missing = [str(pid) for pid in participant_ids if pid not in existing_ids]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Participant user(s) not found: {', '.join(missing)}",
        )


@router.get("", response_model=list[MeetingResponse])
def list_meetings(
    db: DbSession,
    current_user: CurrentUser,
    status: MeetingStatus | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[MeetingResponse]:
    return [
        MeetingResponse.model_validate(m)
        for m in meeting_repo.get_meetings(
            db, status=status, search=search, skip=skip, limit=limit
        )
    ]


@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(
    db: DbSession,
    meeting_in: MeetingCreate,
    current_user: CurrentUser,
) -> MeetingResponse:
    if meeting_in.participant_ids:
        _validate_participants_exist(db, meeting_in.participant_ids)

    return MeetingResponse.model_validate(
        meeting_repo.create_meeting(db, meeting_in, owner_id=current_user.id)
    )


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    db: DbSession,
    meeting_id: uuid.UUID,
    current_user: CurrentUser,
) -> MeetingResponse:
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )
    return MeetingResponse.model_validate(meeting)


@router.put("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    db: DbSession,
    meeting_id: uuid.UUID,
    meeting_in: MeetingUpdate,
    current_user: CurrentUser,
) -> MeetingResponse:
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )

    if meeting.owner_id is not None and meeting.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this meeting",
        )

    if meeting_in.participant_ids is not None:
        _validate_participants_exist(db, meeting_in.participant_ids)

    return MeetingResponse.model_validate(
        meeting_repo.update_meeting(db, meeting, meeting_in)
    )


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(
    db: DbSession,
    meeting_id: uuid.UUID,
    current_user: CurrentUser,
) -> None:
    meeting = meeting_repo.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{meeting_id}' not found",
        )

    if meeting.owner_id is not None and meeting.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this meeting",
        )

    meeting_repo.delete_meeting(db, meeting)
    return None
