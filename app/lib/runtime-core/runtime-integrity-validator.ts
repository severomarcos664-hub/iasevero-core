import fs from 'fs'
import path from 'path'

const ROOT =
  path.join(process.cwd(), 'runtime', 'persistence')

export type RuntimeIntegrityReport = {
  generatedAt: string
  source: string
  governanceValid: boolean
  timelineValid: boolean
  recoveryValid: boolean
  integrity:
    | 'healthy'
    | 'partial'
    | 'critical'
  recommendation: string
  reasoning: string[]
}

function validateDirectory(
  dir: string,
): boolean {

  if (!fs.existsSync(dir)) {
    return false
  }

  const files =
    fs.readdirSync(dir)

  return files.length > 0
}

export function validateRuntimeIntegrity():
  RuntimeIntegrityReport {

  const governanceValid =
    validateDirectory(
      path.join(ROOT, 'governance')
    )

  const timelineValid =
    validateDirectory(
      path.join(ROOT, 'timeline')
    )

  const recoveryValid =
    validateDirectory(
      path.join(ROOT, 'recovery')
    )

  const validCount = [
    governanceValid,
    timelineValid,
    recoveryValid,
  ].filter(Boolean).length

  let integrity:
    | 'healthy'
    | 'partial'
    | 'critical'

  if (validCount === 3) {
    integrity = 'healthy'
  } else if (validCount >= 1) {
    integrity = 'partial'
  } else {
    integrity = 'critical'
  }

  return {
    generatedAt:
      new Date().toISOString(),

    source:
      'runtime-integrity-validator',

    governanceValid,
    timelineValid,
    recoveryValid,

    integrity,

    recommendation:
      integrity === 'healthy'
        ? 'Integridade causal preservada.'
        : integrity === 'partial'
        ? 'Integridade parcialmente preservada.'
        : 'Falha crítica de integridade.',

    reasoning: [
      `governance:${governanceValid}`,
      `timeline:${timelineValid}`,
      `recovery:${recoveryValid}`,
      `integrity:${integrity}`,
    ],
  }
}
