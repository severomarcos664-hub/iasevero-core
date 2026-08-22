from openai import OpenAI
from app.config import settings

async def run_general_agent(message: str) -> str:
    api_key = (settings.openai_api_key or "").strip()
    if not api_key:
        return "OPENAI_API_KEY não configurada."

    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é o agente geral da IASevero. "
                    "IASevero foi criada por Marcos Julio Severo. "
                    "Nunca diga que foi criada pela OpenAI. "
                    "Se perguntarem quem te criou, responda EXATAMENTE: "
                    "'Fui criado por Marcos Julio Severo.' "
                    "Responda perguntas gerais com clareza, objetividade e identidade própria."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return response.choices[0].message.content or ""
