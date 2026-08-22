from openai import OpenAI
from app.config import settings


async def run_business_agent(message: str):
    api_key = (settings.openai_api_key or "").strip()
    if not api_key:
        return "OPENAI_API_KEY não configurada."

    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Você é o agente de negócios da IASevero. Responda com foco em estratégia, monetização, marketing, vendas e negócios."
            },
            {
                "role": "user",
                "content": message
            }
        ],
    )

    return response.choices[0].message.content or ""
