from __future__ import annotations

from typing import List
import os
from openai import OpenAI


class EmbeddingService:

    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise RuntimeError("OPENAI_API_KEY não configurada")

        self.client = OpenAI(api_key=api_key)

        self.model = os.getenv(
            "OPENAI_EMBEDDING_MODEL",
            "text-embedding-3-small"
        )

    def embed(self, text: str) -> List[float]:

        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )

        return response.data[0].embedding
