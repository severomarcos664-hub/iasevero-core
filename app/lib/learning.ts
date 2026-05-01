import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'learning.json')

type Item = {
  message: string
  response: string
  approved: boolean
  uses: number
  score: number
  at: string
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim()
}

function load(): Item[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch {
    return []
  }
}

function save(data: Item[]) {
  fs.writeFileSync(FILE, JSON.stringify(data.slice(-200), null, 2))
}

export function tryLearned(message: string) {
  const db = load()
  const input = normalize(message)

  const item = db.find(x => {
    const base = normalize(x.message)
    return (
      x.approved &&
      (
        base === input ||
        base.includes(input) ||
        input.includes(base)
      )
    )
  })

  if (!item) return null

  item.uses += 1
  item.score += 1
  save(db)

  return item.response
}

export function teach(message: string, response: string) {
  const db = load()
  const item = db.find(x => x.message === message)

  if (item) {
    item.response = response
    item.approved = false
  } else {
    db.push({
      message,
      response,
      approved: false,
      uses: 0,
      score: 0,
      at: new Date().toISOString()
    })
  }

  save(db)
}

export function approve(message: string) {
  const db = load()
  const item = db.find(x => x.message === message)

  if (!item) return false

  item.approved = true
  save(db)
  return true
}

export function listMemory() {
  return load()
}

export function logUnknown(message: string) {
  const db = load()
  const exists = db.find(x => normalize(x.message) === normalize(message))
  if (!exists) {
    db.push({
      message,
      response: '',
      approved: false,
      uses: 0,
      score: 0,
      at: new Date().toISOString()
    })
    save(db)
  }
}
