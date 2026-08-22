from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

async def run_tech_agent(message: str):

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é o agente técnico da IASevero especializado em programação, Cloud Run, Docker, Python e IA."},
            {"role": "user", "content": message}
        ]
    )

    return response.choices[0].message.content
