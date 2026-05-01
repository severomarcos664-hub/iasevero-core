type MemoryItem = {
  role: 'user' | 'assistant'
  text: string
  at: string
}

const memoryStore: Record<string, MemoryItem[]> = {}

export function remember(userId: string, role: 'user' | 'assistant', text: string) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = []
  }

  memoryStore[userId].push({
    role,
    text,
    at: new Date().toISOString()
  })

  if (memoryStore[userId].length > 20) {
    memoryStore[userId].shift()
  }
}

export function recall(userId: string) {
  return (memoryStore[userId] || []).slice(-6)
}
