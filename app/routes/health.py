from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/")
def root():
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@router.get("/ready")
def ready():
    return {
        "status": "ready",
        "service": settings.app_name,
        "version": settings.app_version,
        "openai_configured": bool(settings.openai_api_key),
        "telegram_configured": bool(settings.telegram_bot_token),
    }
