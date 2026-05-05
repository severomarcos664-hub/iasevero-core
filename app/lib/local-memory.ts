import fs from 'fs'

const FILE = 'data/memory.json'

type UserMemory = {
  history: string[]
  facts: Record<string, string>
}

type MemoryDB = Record<string, UserMemory>

function ensureFile() {
  if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true })
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}')
}

function readMemory(): MemoryDB {
  ensureFile()
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeMemory(data: MemoryDB) {
  ensureFile()
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

function getUser(db: MemoryDB, userId: string): UserMemory {
  db[userId] = db[userId] || { history: [], facts: {} }
  return db[userId]
}

export function saveMessage(userId: string, message: string) {
  const db = readMemory()
  const user = getUser(db, userId)
  user.history.push(message)
  user.history = user.history.slice(-12)
  writeMemory(db)
}

export function saveFact(userId: string, key: string, value: string) {
  const db = readMemory()
  const user = getUser(db, userId)
  user.facts[key] = value
  writeMemory(db)
}

export function getHistory(userId: string): string[] {
  const db = readMemory()
  return db[userId]?.history || []
}

export function getFacts(userId: string): Record<string, string> {
  const db = readMemory()
  return db[userId]?.facts || {}
}
