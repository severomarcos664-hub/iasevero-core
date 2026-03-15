import httpx


class TelegramService:
    def __init__(self, bot_token: str, timeout_seconds: float = 20):
        self.base_url = f"https://api.telegram.org/bot{bot_token}"
        self.timeout_seconds = timeout_seconds

    async def send_message(self, chat_id: int | str, text: str) -> dict:
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post(
                f"{self.base_url}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": text,
                },
            )
            response.raise_for_status()
            return response.json()
