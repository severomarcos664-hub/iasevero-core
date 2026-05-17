import fs from 'fs'
import path from 'path'

export type RuntimeSnapshot = {
  timestamp: string
  stable: boolean
  provider: string
  mode: string
  awareness: string
  recovery: boolean
  stabilization: string
  memoryMode: string
}

const SNAPSHOT_DIR = path.join(process.cwd(), 'runtime')
const SNAPSHOT_FILE = path.join(
  SNAPSHOT_DIR,
  'runtime-snapshots.json'
)

function ensureRuntimeSnapshotFile() {

  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true })
  }

  if (!fs.existsSync(SNAPSHOT_FILE)) {
    fs.writeFileSync(
      SNAPSHOT_FILE,
      JSON.stringify([], null, 2)
    )
  }
}

export function persistRuntimeSnapshot(
  snapshot?: RuntimeSnapshot
): RuntimeSnapshot {

  ensureRuntimeSnapshotFile()

  const current =
    JSON.parse(
      fs.readFileSync(SNAPSHOT_FILE, 'utf8')
    )

  const safeSnapshot: RuntimeSnapshot = snapshot || {
    timestamp: new Date().toISOString(),
    stable: true,
    provider: 'local',
    mode: 'local',
    awareness: 'unknown',
    recovery: false,
    stabilization: 'unknown',
    memoryMode: 'unknown'
  }

  const next = [
    safeSnapshot,
    ...current
  ].slice(0, 300)

  fs.writeFileSync(
    SNAPSHOT_FILE,
    JSON.stringify(next, null, 2)
  )

  return safeSnapshot
}

export function readRuntimeSnapshots():
RuntimeSnapshot[] {

  ensureRuntimeSnapshotFile()

  return JSON.parse(
    fs.readFileSync(SNAPSHOT_FILE, 'utf8')
  )
}
