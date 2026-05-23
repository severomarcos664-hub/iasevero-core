import fs from 'fs'
import path from 'path'

const ROOT =
  path.join(process.cwd(), 'runtime', 'persistence')

export type RuntimeRecoveryState = {
  generatedAt: string
  source: string
  governanceRecovered: boolean
  timelineRecovered: boolean
  recoveryRecovered: boolean
  operationalState:
    | 'stable'
    | 'partial'
    | 'critical'
  recommendation: string
  reasoning: string[]
}

function latestFile(dir: string) {

  if (!fs.existsSync(dir)) {
    return null
  }

  const files =
    fs.readdirSync(dir).sort()

  if (!files.length) {
    return null
  }

  return path.join(dir, files.at(-1)!)
}

export function recoverRuntimeState():
  RuntimeRecoveryState {

  const governance =
    latestFile(path.join(ROOT, 'governance'))

  const timeline =
    latestFile(path.join(ROOT, 'timeline'))

  const recovery =
    latestFile(path.join(ROOT, 'recovery'))

  const governanceRecovered =
    Boolean(governance)

  const timelineRecovered =
    Boolean(timeline)

  const recoveryRecovered =
    Boolean(recovery)

  const recoveredCount = [
    governanceRecovered,
    timelineRecovered,
    recoveryRecovered,
  ].filter(Boolean).length

  let operationalState:
    | 'stable'
    | 'partial'
    | 'critical'

  if (recoveredCount === 3) {
    operationalState = 'stable'
  } else if (recoveredCount >= 1) {
    operationalState = 'partial'
  } else {
    operationalState = 'critical'
  }

  return {
    generatedAt:
      new Date().toISOString(),

    source:
      'runtime-recovery-engine',

    governanceRecovered,
    timelineRecovered,
    recoveryRecovered,

    operationalState,

    recommendation:
      operationalState === 'stable'
        ? 'Runtime restaurado com sucesso.'
        : operationalState === 'partial'
        ? 'Runtime parcialmente restaurado.'
        : 'Falha crítica de restauração.',

    reasoning: [
      `governance:${governanceRecovered}`,
      `timeline:${timelineRecovered}`,
      `recovery:${recoveryRecovered}`,
      `state:${operationalState}`,
    ],
  }
}
