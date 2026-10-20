import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


class UserBase(BaseModel):
    email: str = Field(pattern=EMAIL_REGEX, max_length=255)
    name: str = Field(min_length=1, max_length=255)
    role: str = Field(default="Member", min_length=1, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=1024)


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: str = Field(pattern=EMAIL_REGEX, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = Field(default=None, pattern=EMAIL_REGEX, max_length=255)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=1024)
    password: str | None = Field(default=None, min_length=6, max_length=128)
    is_active: bool | None = None


class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
