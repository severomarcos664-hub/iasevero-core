import os
from pydantic import BaseModel


def env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


class Settings(BaseModel):
    app_name: str = "IASevero Core"
    app_version: str = "4.0.0"
    environment: str = os.getenv("ENVIRONMENT", "production")
    port: int = int(os.getenv("PORT", "8080"))
    log_level: str = os.getenv("LOG_LEVEL", "INFO").upper()

    openai_api_key: str | None = (os.getenv("OPENAI_API_KEY") or "").strip() or None
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-5.4")

    telegram_bot_token: str | None = (os.getenv("TELEGRAM_BOT_TOKEN") or "").strip() or None
    telegram_webhook_secret: str | None = (os.getenv("TELEGRAM_WEBHOOK_SECRET") or "").strip() or None

    require_openai: bool = env_bool("REQUIRE_OPENAI", False)
    require_telegram: bool = env_bool("REQUIRE_TELEGRAM", False)

    max_input_chars: int = int(os.getenv("MAX_INPUT_CHARS", "8000"))
    request_timeout_seconds: float = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "45"))
    in_memory_rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "30"))


settings = Settings()
