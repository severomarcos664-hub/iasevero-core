from __future__ import annotations

from typing import List, Dict, Any
from app.memory_vector.embedding_service import EmbeddingService
from app.memory_vector.vector_store import VectorStore


class MemorySearch:
    def __init__(self) -> None:
        self.embedder = EmbeddingService()
        self.store = VectorStore()

    def remember(self, chat_id: str, role: str, content: str) -> None:
        text = f"[chat:{chat_id}] [{role}] {content}"
        embedding = self.embedder.embed(text)
        self.store.add(
            embedding,
            {
                "chat_id": str(chat_id),
                "role": role,
                "content": content,
            },
        )

    def recall(self, chat_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        embedding = self.embedder.embed(query)
        results = self.store.search(embedding, top_k=top_k)
        return [r for r in results if str(r.get("chat_id")) == str(chat_id)]
