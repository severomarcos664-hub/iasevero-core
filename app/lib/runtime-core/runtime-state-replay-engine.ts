import fs from 'fs'
import path from 'path'

const ROOT =
  path.join(process.cwd(), 'runtime', 'persistence')

export type RuntimeReplayEntry = {
  type: string
  file: string
}

export type RuntimeReplayState = {
  generatedAt: string
  source: string
  totalEntries: number
  replayHealth:
    | 'healthy'
    | 'partial'
    | 'critical'
  recommendation: string
  entries: RuntimeReplayEntry[]
  reasoning: string[]
}

function collectEntries(
  dir: string,
  type: string,
): RuntimeReplayEntry[] {

  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir)
    .sort()
    .map(file => ({
      type,
      file,
    }))
}

export function replayRuntimeState():
  RuntimeReplayState {

  const governance =
    collectEntries(
      path.join(ROOT, 'governance'),
      'governance',
    )

  const timeline =
    collectEntries(
      path.join(ROOT, 'timeline'),
      'timeline',
    )

  const recovery =
    collectEntries(
      path.join(ROOT, 'recovery'),
      'recovery',
    )

  const entries = [
    ...governance,
    ...timeline,
    ...recovery,
  ]

  let replayHealth:
    | 'healthy'
    | 'partial'
    | 'critical'

  if (entries.length >= 3) {
    replayHealth = 'healthy'
  } else if (entries.length >= 1) {
    replayHealth = 'partial'
  } else {
    replayHealth = 'critical'
  }

  return {
    generatedAt:
      new Date().toISOString(),

    source:
      'runtime-state-replay-engine',

    totalEntries:
      entries.length,

    replayHealth,

    recommendation:
      replayHealth === 'healthy'
        ? 'Replay causal íntegro.'
        : replayHealth === 'partial'
        ? 'Replay parcial disponível.'
        : 'Falha crítica de replay.',

    entries,

    reasoning: [
      `entries:${entries.length}`,
      `health:${replayHealth}`,
      `governance:${governance.length}`,
      `timeline:${timeline.length}`,
      `recovery:${recovery.length}`,
    ],
  }
}
