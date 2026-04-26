import fs from "fs"

const path = "./data/memory.json"

type MemoryItem = {
  user: string
  message: string
  time: string
}

export function saveMemory(user: string, message: string) {
  let db: MemoryItem[] = []

  if (fs.existsSync(path)) {
    db = JSON.parse(fs.readFileSync(path, "utf-8"))
  }

  db.push({
    user,
    message,
    time: new Date().toISOString()
  })

  fs.writeFileSync(path, JSON.stringify(db, null, 2))
}

export function getMemory(user: string): MemoryItem[] {
  if (!fs.existsSync(path)) return []

  const db: MemoryItem[] = JSON.parse(fs.readFileSync(path, "utf-8"))

  return db.filter((item) => item.user === user).slice(-10)
}
