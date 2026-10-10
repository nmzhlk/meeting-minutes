import uuid
from fastapi import APIRouter, HTTPException, status
from app.api.dependencies import DbSession
from app.schemas.action_item import (
    ActionItemCreate,
    ActionItemUpdate,
    ActionItemStatusUpdate,
    ActionItemResponse,
)
from app.repositories import action_item as action_repo
from app.repositories import meeting as meeting_repo
from app.repositories import participant as participant_repo

router = APIRouter()


@router.get("", response_model=list[ActionItemResponse])
def list_action_items(
    db: DbSession,
    meeting_id: uuid.UUID | None = None,
    assignee_id: uuid.UUID | None = None,
    status: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    return action_repo.get_action_items(
        db,
        meeting_id=meeting_id,
        assignee_id=assignee_id,
        status=status,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=ActionItemResponse, status_code=status.HTTP_201_CREATED)
def create_action_item(db: DbSession, action_in: ActionItemCreate):
    meeting = meeting_repo.get_meeting(db, action_in.meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id '{action_in.meeting_id}' not found",
        )

    if action_in.assignee_id:
        assignee = participant_repo.get_participant(db, action_in.assignee_id)
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Participant with id '{action_in.assignee_id}' not found",
            )

    return action_repo.create_action_item(db, action_in)


@router.get("/{action_id}", response_model=ActionItemResponse)
def get_action_item(db: DbSession, action_id: uuid.UUID):
    item = action_repo.get_action_item(db, action_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id '{action_id}' not found",
        )
    return item


@router.patch("/{action_id}/status", response_model=ActionItemResponse)
def update_action_item_status(
    db: DbSession, action_id: uuid.UUID, status_in: ActionItemStatusUpdate
):
    item = action_repo.get_action_item(db, action_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id '{action_id}' not found",
        )
    return action_repo.update_action_item_status(db, item, status_in.status)


@router.put("/{action_id}", response_model=ActionItemResponse)
def update_action_item(
    db: DbSession, action_id: uuid.UUID, action_in: ActionItemUpdate
):
    item = action_repo.get_action_item(db, action_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id '{action_id}' not found",
        )

    if action_in.assignee_id:
        assignee = participant_repo.get_participant(db, action_in.assignee_id)
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Participant with id '{action_in.assignee_id}' not found",
            )

    return action_repo.update_action_item(db, item, action_in)


@router.delete("/{action_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_action_item(db: DbSession, action_id: uuid.UUID):
    item = action_repo.get_action_item(db, action_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id '{action_id}' not found",
        )
    action_repo.delete_action_item(db, item)
    return None
