import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'learning.json')

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch {
    return []
  }
}

function save(data: any[]) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function logUnknown(message: string) {
  const db = load()
  if (!db.find((x: any) => x.message === message)) {
    db.push({ message, at: new Date().toISOString() })
    save(db)
  }
}

export function tryLearned(message: string) {
  const db = load()
  const item = db.find((x: any) => x.message === message && x.response)
  return item?.response || null
}

export function teach(message: string, response: string) {
  const db = load()
  const item = db.find((x: any) => x.message === message)

  if (item) {
    item.response = response
  } else {
    db.push({ message, response, at: new Date().toISOString() })
  }

  save(db)
}

export function approve(message: string) {
  return true
}

export function listMemory() {
  return load()
}
