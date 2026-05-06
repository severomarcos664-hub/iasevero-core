import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'context.json')

type Turn = {
  userId: string
  message: string
  reply: string
  at: string
}

function load(): Turn[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch {
    return []
  }
}

function save(data: Turn[]) {
  fs.writeFileSync(FILE, JSON.stringify(data.slice(-200), null, 2))
}

export function saveTurn(userId: string, message: string, reply: string) {
  const db = load()
  db.push({
    userId,
    message,
    reply,
    at: new Date().toISOString()
  })
  save(db)
}

export function contextSummary(userId: string) {
  const db = load().filter(x => x.userId === userId).slice(-6)

  if (!db.length) return null

  return db
    .map(x => `Usuário: ${x.message}\nIASevero: ${x.reply}`)
    .join('\n\n')
}
