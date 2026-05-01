import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'learning.json')

type Item = {
  message: string
  response?: string
  approved: boolean
  uses: number
  score: number
  at: string
}

function normalize(text: string) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function similarity(a: string, b: string) {
  const A = new Set(normalize(a).split(' ').filter(Boolean))
  const B = new Set(normalize(b).split(' ').filter(Boolean))
  const inter = [...A].filter(x => B.has(x)).length
  const union = new Set([...A, ...B]).size || 1
  return inter / union
}

function load(): Item[] {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) }
  catch { return [] }
}

function save(data: Item[]) {
  const cleaned = data
    .filter(i => i.message)
    .filter(i => i.response || i.uses < 3)
    .sort((a, b) => (b.score + b.uses) - (a.score + a.uses))
    .slice(0, 300)

  fs.writeFileSync(FILE, JSON.stringify(cleaned, null, 2))
}

export function logUnknown(message: string) {
  const db = load()
  const n = normalize(message)

  if (!db.find(x => normalize(x.message) === n)) {
    db.push({
      message,
      approved: false,
      uses: 0,
      score: 0,
      at: new Date().toISOString()
    })
    save(db)
  }
}

export function tryLearned(message: string) {
  const db = load()
  const candidates = db
    .filter(x => x.approved && x.response)
    .map(item => ({
      item,
      sim: similarity(message, item.message)
    }))
    .filter(x => x.sim >= 0.25)
    .sort((a, b) => b.sim - a.sim || b.item.score - a.item.score)

  const best = candidates[0]
  if (!best) return null

  best.item.uses += 1
  best.item.score += best.sim
  save(db)

  return best.item.response || null
}

export function teach(message: string, response: string) {
  const db = load()
  const n = normalize(message)
  const item = db.find(x => normalize(x.message) === n)

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
  const n = normalize(message)
  const item = db.find(x => normalize(x.message) === n)

  if (!item) return false

  item.approved = true
  item.score += 2
  save(db)

  return true
}

export function listMemory() {
  return load()
}
