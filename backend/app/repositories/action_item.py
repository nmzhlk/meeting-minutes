import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models.action_item import ActionItem
from app.schemas.action_item import ActionItemCreate, ActionItemUpdate


def get_action_item(db: Session, action_id: uuid.UUID) -> Optional[ActionItem]:
    query = (
        select(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .where(ActionItem.id == action_id)
    )
    return db.scalar(query)


def get_action_items(
    db: Session,
    meeting_id: Optional[uuid.UUID] = None,
    assignee_id: Optional[uuid.UUID] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[ActionItem]:
    query = (
        select(ActionItem)
        .options(joinedload(ActionItem.assignee))
        .order_by(ActionItem.created_at.desc())
    )
    if meeting_id:
        query = query.where(ActionItem.meeting_id == meeting_id)
    if assignee_id:
        query = query.where(ActionItem.assignee_id == assignee_id)
    if status:
        query = query.where(ActionItem.status == status)

    query = query.offset(skip).limit(limit)
    return list(db.scalars(query).all())


def create_action_item(db: Session, obj_in: ActionItemCreate) -> ActionItem:
    db_obj = ActionItem(
        meeting_id=obj_in.meeting_id,
        assignee_id=obj_in.assignee_id,
        title=obj_in.title,
        due_date=obj_in.due_date,
        status=obj_in.status,
        priority=obj_in.priority,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return get_action_item(db, db_obj.id) or db_obj


def update_action_item(
    db: Session, db_obj: ActionItem, obj_in: ActionItemUpdate
) -> ActionItem:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return get_action_item(db, db_obj.id) or db_obj


def update_action_item_status(
    db: Session, db_obj: ActionItem, new_status: str
) -> ActionItem:
    db_obj.status = new_status
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return get_action_item(db, db_obj.id) or db_obj


def delete_action_item(db: Session, db_obj: ActionItem) -> ActionItem:
    db.delete(db_obj)
    db.commit()
    return db_obj
