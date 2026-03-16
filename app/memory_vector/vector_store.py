from __future__ import annotations

from pathlib import Path
from typing import List, Dict, Any
import json
import faiss
import numpy as np


class VectorStore:

    def __init__(self, dim: int = 1536, base_path: str = "data/vector_memory") -> None:
        self.dim = dim
        self.base = Path(base_path)
        self.base.mkdir(parents=True, exist_ok=True)

        self.index_path = self.base / "memory.index"
        self.meta_path = self.base / "memory_meta.json"

        if self.index_path.exists():
            self.index = faiss.read_index(str(self.index_path))
        else:
            self.index = faiss.IndexFlatL2(self.dim)

        if self.meta_path.exists():
            self.metadata: List[Dict[str, Any]] = json.loads(
                self.meta_path.read_text(encoding="utf-8")
            )
        else:
            self.metadata = []

    def add(self, embedding: List[float], metadata: Dict[str, Any]) -> None:
        vec = np.array([embedding], dtype="float32")

        if vec.shape[1] != self.dim:
            raise ValueError(
                f"Embedding dimension {vec.shape[1]} diferente de {self.dim}"
            )

        self.index.add(vec)
        self.metadata.append(metadata)

        self._save()

    def search(self, embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:

        if self.index.ntotal == 0:
            return []

        vec = np.array([embedding], dtype="float32")

        distances, indices = self.index.search(vec, top_k)

        results: List[Dict[str, Any]] = []

        for idx, dist in zip(indices[0], distances[0]):
            if idx == -1:
                continue

            item = dict(self.metadata[idx])
            item["score"] = float(dist)

            results.append(item)

        return results

    def _save(self) -> None:

        faiss.write_index(self.index, str(self.index_path))

        self.meta_path.write_text(
            json.dumps(self.metadata, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
