from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

async def run_general_agent(message: str):

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é o agente geral da IASevero. Responda perguntas gerais com clareza."},
            {"role": "user", "content": message}
        ]
    )

    return response.choices[0].message.content
