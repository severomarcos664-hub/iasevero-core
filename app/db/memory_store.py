from sqlalchemy import select
from app.db.database import AsyncSessionLocal
from app.db.models import ChatMemory

async def save_message(chat_id: int, role: str, content: str) -> None:
    async with AsyncSessionLocal() as session:
        session.add(ChatMemory(chat_id=chat_id, role=role, content=content))
        await session.commit()

async def get_recent_messages(chat_id: int, limit: int = 6) -> list[dict]:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ChatMemory)
            .where(ChatMemory.chat_id == chat_id)
            .order_by(ChatMemory.created_at.desc())
            .limit(limit)
        )
        rows = list
