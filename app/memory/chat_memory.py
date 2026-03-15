from collections import defaultdict, deque
from typing import Deque, Dict, List

MAX_MESSAGES = 12

_memory: Dict[int, Deque[dict]] = defaultdict(lambda: deque(maxlen=MAX_MESSAGES))

def add_message(user_id: int, role: str, content: str) -> None:
    _memory[user_id].append({"role": role, "content": content})

def get_messages(user_id: int) -> List[dict]:
    return list(_memory[user_id])

def clear_messages(user_id: int) -> None:
    _memory[user_id].clear()
