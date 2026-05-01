import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'memory.json')

type Memory = Record<string, any>

function load(): Memory {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function save(data: Memory) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function getUser(userId: string) {
  const db = load()
  return db[userId] || {}
}

export function setUser(userId: string, data: any) {
  const db = load()
  db[userId] = { ...(db[userId] || {}), ...data }
  save(db)
}
