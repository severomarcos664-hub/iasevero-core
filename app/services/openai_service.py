from datetime import datetime, timezone, timedelta
from openai import OpenAI
from app.config import settings


class OpenAIService:
    def __init__(self):
        api_key = settings.openai_api_key
        if not api_key:
            raise ValueError("OPENAI_API_KEY não configurada")

        self.client = OpenAI(api_key=api_key)

    async def ask(self, message: str) -> str:
        br_tz = timezone(timedelta(hours=-3))
        current_dt = datetime.now(br_tz).strftime("%d/%m/%Y %H:%M:%S (-03)")

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é IASevero, uma inteligência artificial criada por Marcos Julio Severo. "
                        f"A data e hora atual no Brasil é {current_dt}. "
                        "Quando o usuário perguntar sobre dia, data, hora ou momento atual, use essa referência. "
                        "Se não souber algo atual da internet, diga que precisa de busca em tempo real."
                    ),
                },
                {
                    {"role": "system", "content": "Você é IASevero, inteligência artificial criada por Marcos Julio Severo."},
        {"role": "user",
                    "content": message
                }
            ]
        )

        return response.choices[0].message.content or ""

    async def chat(self, message: str) -> str:
        return await self.ask(message)
