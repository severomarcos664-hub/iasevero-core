from app.agents.general_agent import run_general_agent
from app.agents.tech_agent import run_tech_agent
from app.agents.vision_agent import run_vision_agent
from app.agents.business_agent import run_business_agent

AGENTS = {
    "general_agent": run_general_agent,
    "tech_agent": run_tech_agent,
    "vision_agent": run_vision_agent,
    "business_agent": run_business_agent,
}

async def invoke_agent(agent_name: str, message: str):
    agent = AGENTS.get(agent_name)

    if not agent:
        return "Agente não encontrado."

    return await agent(message)
