from app.config import settings
from app.services.openai_service import OpenAIService
from app.services.telegram_service import TelegramService


def get_openai_service() -> OpenAIService | None:
    if not settings.openai_api_key:
        return None
    return OpenAIService()


def get_telegram_service() -> TelegramService | None:
    if not settings.telegram_bot_token:
        return None
    return TelegramService(
        bot_token=settings.telegram_bot_token,
        timeout_seconds=settings.request_timeout_seconds,
    )
