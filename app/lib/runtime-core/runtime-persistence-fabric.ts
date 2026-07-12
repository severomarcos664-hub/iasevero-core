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

export function readRuntimePersistenceRecords(
  category: RuntimePersistenceRecord['category'],
): RuntimePersistenceRecord[] {
  const targetDir = path.join(ROOT, category)

  if (!fs.existsSync(targetDir)) {
    return []
  }

  const records: RuntimePersistenceRecord[] = []

  for (const file of fs.readdirSync(targetDir).sort()) {
    const targetFile = path.join(targetDir, file)

    try {
      const parsed = JSON.parse(
        fs.readFileSync(targetFile, 'utf8'),
      ) as Partial<RuntimePersistenceRecord>

      if (
        typeof parsed.id === 'string' &&
        typeof parsed.timestamp === 'string' &&
        typeof parsed.source === 'string' &&
        parsed.category === category &&
        'payload' in parsed
      ) {
        records.push(
          parsed as RuntimePersistenceRecord,
        )
      }
    } catch {
      // Registros inválidos são ignorados com fallback seguro.
    }
  }

  return records
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
