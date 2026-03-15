from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

async def run_business_agent(message: str):

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é o agente de negócios da IASevero especializado em estratégia, marketing e monetização."},
            {"role": "user", "content": message}
        ]
    )

    return response.choices[0].message.content
