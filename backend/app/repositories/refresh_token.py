import uuid
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken


def create_refresh_token(
    db: Session,
    user_id: uuid.UUID,
    payload: str,
    expires_at: datetime,
) -> RefreshToken:
    db_obj = RefreshToken(
        user_id=user_id,
        payload=payload,
        expires_at=expires_at,
        revoked=False,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_refresh_token(db: Session, payload: str) -> RefreshToken | None:
    return db.scalar(select(RefreshToken).where(RefreshToken.payload == payload))


def is_token_valid(token_obj: RefreshToken | None) -> bool:
    if not token_obj:
        return False
    if token_obj.revoked:
        return False
    now = datetime.now(timezone.utc)

    exp = token_obj.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    return exp > now


def revoke_refresh_token(db: Session, token_obj: RefreshToken) -> RefreshToken:
    token_obj.revoked = True
    db.add(token_obj)
    db.commit()
    db.refresh(token_obj)
    return token_obj


def revoke_all_user_tokens(db: Session, user_id: uuid.UUID) -> None:
    stmt = (
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked.is_(False))
        .values(revoked=True)
    )
    db.execute(stmt)
    db.commit()
