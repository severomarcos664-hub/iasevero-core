import fs from 'fs'

const FILE = 'data/memory.json'

function readMemory() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeMemory(data: any) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function saveMessage(userId: string, message: string) {
  const db = readMemory()
  db[userId] = db[userId] || []
  db[userId].push(message)

  // mantém só últimos 5
  db[userId] = db[userId].slice(-5)

  writeMemory(db)
}

export function getHistory(userId: string): string[] {
  const db = readMemory()
  return db[userId] || []
}
