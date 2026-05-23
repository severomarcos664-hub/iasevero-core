import fs from 'fs'
import path from 'path'

export type RuntimePersistenceRecord = {
  id: string
  timestamp: string
  source: string
  category:
    | 'governance'
    | 'timeline'
    | 'recovery'
    | 'telemetry'
    | 'runtime-state'
  payload: unknown
}

const ROOT =
  path.join(process.cwd(), 'runtime', 'persistence')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function persistRuntimeRecord(
  record: RuntimePersistenceRecord
): string {

  const categoryDir =
    path.join(ROOT, record.category)

  ensureDir(categoryDir)

  const filename =
    `${record.timestamp}_${record.id}.json`

  const filepath =
    path.join(categoryDir, filename)

  fs.writeFileSync(
    filepath,
    JSON.stringify(record, null, 2),
    'utf8'
  )

  return filepath
}

export function readRuntimePersistence(
  category?: RuntimePersistenceRecord['category']
) {

  const targetDir =
    category
      ? path.join(ROOT, category)
      : ROOT

  if (!fs.existsSync(targetDir)) {
    return []
  }

  const files =
    fs.readdirSync(targetDir)

  return files.sort()
}

export function buildRuntimePersistenceRecord(
  source: string,
  category: RuntimePersistenceRecord['category'],
  payload: unknown
): RuntimePersistenceRecord {

  return {
    id:
      `rpf_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    timestamp:
      new Date().toISOString(),

    source,
    category,
    payload,
  }
}
