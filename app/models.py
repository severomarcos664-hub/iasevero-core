from typing import Optional, Any
from pydantic import BaseModel, Field


class PromptRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    user_id: Optional[str] = Field(default=None, max_length=128)
    session_id: Optional[str] = Field(default=None, max_length=128)


class PromptResponse(BaseModel):
    reply: str
    service: str
    version: str
    model: str | None = None
    request_id: str | None = None


class TelegramWebhookMessage(BaseModel):
    update_id: int | None = None
    message: dict[str, Any] | None = None
