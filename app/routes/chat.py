import logging
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models import PromptRequest, PromptResponse
from app.services.router_service import RouterService
from app.agents.agent_factory import invoke_agent

logger = logging.getLogger("iasevero.chat")
router = APIRouter(prefix="/chat", tags=["chat"])

router_service = RouterService()

@router.post("", response_model=PromptResponse)
async def chat(req: PromptRequest):
    message = req.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Mensagem vazia.")

    if len(message) > settings.max_input_chars:
        raise HTTPException(
            status_code=400,
            detail="Mensagem excede o limite configurado.",
        )

    try:
        agent_name = router_service.route(message)
        reply = await invoke_agent(agent_name, message)
    except Exception as exc:
        logger.exception("Erro ao consultar agentes: %r", exc)
        raise HTTPException(
            status_code=502,
            detail=f"Falha ao consultar o motor de IA: {exc}",
        )

    return PromptResponse(
        reply=reply,
        service=settings.app_name,
        version=settings.app_version,
        model="gpt-4o-mini",
        request_id=None,
    )
