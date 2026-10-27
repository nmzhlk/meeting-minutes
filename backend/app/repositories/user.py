import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user(db: Session, user_id: uuid.UUID) -> User | None:
    return db.scalar(select(User).where(User.id == user_id))


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_users_by_ids(db: Session, user_ids: list[uuid.UUID]) -> list[User]:
    if not user_ids:
        return []
    query = select(User).where(User.id.in_(user_ids))
    return list(db.scalars(query).all())


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    query = select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(query).all())


def create_user(db: Session, obj_in: UserCreate) -> User:
    hashed_password = get_password_hash(obj_in.password)
    db_obj = User(
        email=obj_in.email,
        name=obj_in.name,
        role=obj_in.role,
        avatar_url=obj_in.avatar_url,
        hashed_password=hashed_password,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_user(db: Session, db_obj: User, obj_in: UserUpdate) -> User:
    update_data = obj_in.model_dump(exclude_unset=True)
    if "password" in update_data:
        raw_password = update_data.pop("password")
        if raw_password:
            db_obj.hashed_password = get_password_hash(raw_password)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_user(db: Session, db_obj: User) -> User:
    db.delete(db_obj)
    db.commit()
    return db_obj
