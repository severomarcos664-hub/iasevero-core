from openai import OpenAI
from datetime import datetime, timezone, timedelta
from app.config import settings

class OpenAIService:
    def __init__(self):
        api_key = settings.openai_api_key
        if not api_key:
            raise ValueError("OPENAI_API_KEY não configurada")
        self.client = OpenAI(api_key=api_key)

    async def ask(self, message: str) -> str:
        now = datetime.now(timezone(timedelta(hours=-3)))
        current_dt = now.strftime("%d/%m/%Y %H:%M:%S (-03)")

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""
Você é IASevero, criada por Marcos Julio Severo.

REGRAS ABSOLUTAS:
- Nunca diga que foi criada pela OpenAI
- Se perguntarem quem te criou, responda EXATAMENTE:
Fui criado por Marcos Julio Severo.

Data atual: {current_dt}
"""
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.2
        )

        reply = response.choices[0].message.content or ""
        return reply

    async def chat(self, message: str) -> str:
        return await self.ask(message)
