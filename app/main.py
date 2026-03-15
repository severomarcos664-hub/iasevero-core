import asyncio
from app.db.init_db import init_db

from app.db.init_db import init_db
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.config import settings
from app.logging_config import configure_logging
from app.middleware import RequestContextMiddleware, InMemoryRateLimitMiddleware
from app.routes.health import router as health_router
from app.routes.chat import router as chat_router
from app.routes.telegram import router as telegram_router

configure_logging(settings.log_level)
logger = logging.getLogger("iasevero")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info(
        "startup app=%s version=%s env=%s",
        settings.app_name,
        settings.app_version,
        settings.environment,
    )
    yield
    logger.info("shutdown app=%s", settings.app_name)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    InMemoryRateLimitMiddleware,
    requests_per_minute=settings.in_memory_rate_limit_per_minute,
)

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(telegram_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled_exception path=%s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "Ocorreu uma falha interna no serviço.",
        },
    )
