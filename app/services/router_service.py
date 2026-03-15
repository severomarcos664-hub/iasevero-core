# app/services/router_service.py

class RouterService:
    """
    Router da IASevero.
    Decide qual agente deve processar a mensagem.
    """

    def route(self, message: str) -> str:
        msg = message.lower()

        vision_keywords = [
            "imagem",
            "foto",
            "print",
            "screenshot",
            "analisar imagem"
        ]
        if any(k in msg for k in vision_keywords):
            return "vision_agent"

        tech_keywords = [
            "erro",
            "bug",
            "deploy",
            "cloud run",
            "docker",
            "api",
            "python",
            "código",
            "code"
        ]
        if any(k in msg for k in tech_keywords):
            return "tech_agent"

        business_keywords = [
            "negócio",
            "empresa",
            "vendas",
            "marketing",
            "clientes",
            "dinheiro",
            "monetizar"
        ]
        if any(k in msg for k in business_keywords):
            return "business_agent"

        return "general_agent"
