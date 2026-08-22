import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

raw_db_url = os.getenv("DATABASE_URL", "").strip()

if (
    not raw_db_url
    or "MANUAL_" in raw_db_url
    or "CUSTOMER_" in raw_db_url
    or "MIN_INSTANCE" in raw_db_url
):
    DATABASE_URL = "sqlite+aiosqlite:///./iasevero.db"
else:
    DATABASE_URL = raw_db_url
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
