from fastapi import APIRouter

from app.api.action_items import router as action_items_router
from app.api.meetings import router as meetings_router
from app.api.users import router as users_router

api_router = APIRouter()

api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(meetings_router, prefix="/meetings", tags=["meetings"])
api_router.include_router(
    action_items_router, prefix="/action-items", tags=["action-items"]
)
