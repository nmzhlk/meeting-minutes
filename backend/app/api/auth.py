from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DbSession
from app.core.config import settings
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    get_refresh_token_expiration,
    verify_password,
)
from app.repositories import refresh_token as refresh_repo
from app.repositories import user as user_repo
from app.schemas.auth import (
    TokenRefreshRequest,
    TokenRefreshResponse,
    TokenResponse,
)
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(db: DbSession, user_in: UserCreate) -> TokenResponse:
    existing_user = user_repo.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{user_in.email}' already exists",
        )

    user = user_repo.create_user(db, user_in)
    access_token = create_access_token(str(user.id))
    refresh_token = generate_refresh_token()
    refresh_repo.create_refresh_token(
        db,
        user_id=user.id,
        token=refresh_token,
        expires_at=get_refresh_token_expiration(),
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(db: DbSession, login_in: UserLogin) -> TokenResponse:
    user = user_repo.get_user_by_email(db, login_in.email)
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account",
        )

    access_token = create_access_token(str(user.id))
    refresh_token = generate_refresh_token()
    refresh_repo.create_refresh_token(
        db,
        user_id=user.id,
        token=refresh_token,
        expires_at=get_refresh_token_expiration(),
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=TokenRefreshResponse)
def refresh_token(
    db: DbSession, refresh_in: TokenRefreshRequest
) -> TokenRefreshResponse:
    token_obj = refresh_repo.get_refresh_token(db, refresh_in.refresh_token)
    if not token_obj or not refresh_repo.is_token_valid(token_obj):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired or revoked refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = user_repo.get_user(db, token_obj.user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    new_access_token = create_access_token(str(user.id))

    return TokenRefreshResponse(
        access_token=new_access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(db: DbSession, logout_in: TokenRefreshRequest) -> None:
    token_obj = refresh_repo.get_refresh_token(db, logout_in.refresh_token)
    if token_obj and not token_obj.revoked:
        refresh_repo.revoke_refresh_token(db, token_obj)
    return None


@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(current_user)
