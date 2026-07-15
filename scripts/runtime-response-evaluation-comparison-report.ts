import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'

type EvaluationResult = {
  test: string
  passed: boolean
  durationMs: number
  error: string | null
}

type EvaluationReport = {
  schemaVersion: string
  source: string
  generatedAt: string
  runtimeVersion: {
    tag: string
    commit: string
    branch: string
  }
  summary: {
    testCount: number
    passedCount: number
    failedCount: number
    successRate: number
  }
  results: EvaluationResult[]
}

const reportDirectory = resolve('runtime', 'evaluation-reports')

const reportFiles = process.argv.slice(2)

if (reportFiles.length !== 2) {
  throw new Error(
    'Provide exactly two evaluation report paths: baseline and candidate.',
  )
}

const [baselinePath, candidatePath] = reportFiles.map((file) =>
  resolve(file),
)

const parseReport = (path: string): EvaluationReport =>
  JSON.parse(readFileSync(path, 'utf8')) as EvaluationReport

const baseline = parseReport(baselinePath)
const candidate = parseReport(candidatePath)

const baselineByTest = new Map(
  baseline.results.map((result) => [result.test, result]),
)

const comparisons = candidate.results.map((candidateResult) => {
  const baselineResult = baselineByTest.get(candidateResult.test)

  if (!baselineResult) {
    return {
      test: candidateResult.test,
      status: 'new-test',
      baselinePassed: null,
      candidatePassed: candidateResult.passed,
      baselineDurationMs: null,
      candidateDurationMs: candidateResult.durationMs,
      durationDeltaMs: null,
    }
  }

  const status =
    baselineResult.passed && !candidateResult.passed
      ? 'regression'
      : !baselineResult.passed && candidateResult.passed
        ? 'improvement'
        : 'stable'

  return {
    test: candidateResult.test,
    status,
    baselinePassed: baselineResult.passed,
    candidatePassed: candidateResult.passed,
    baselineDurationMs: baselineResult.durationMs,
    candidateDurationMs: candidateResult.durationMs,
    durationDeltaMs:
      candidateResult.durationMs - baselineResult.durationMs,
  }
})

const regressions = comparisons.filter(
  (comparison) => comparison.status === 'regression',
).length

const improvements = comparisons.filter(
  (comparison) => comparison.status === 'improvement',
).length

const stable = comparisons.filter(
  (comparison) => comparison.status === 'stable',
).length

const report = {
  schemaVersion: 'v1',
  source: 'runtime-response-evaluation-comparison-report',
  generatedAt: new Date().toISOString(),
  baseline: {
    file: basename(baselinePath),
    generatedAt: baseline.generatedAt,
    runtimeVersion: baseline.runtimeVersion,
    summary: baseline.summary,
  },
  candidate: {
    file: basename(candidatePath),
    generatedAt: candidate.generatedAt,
    runtimeVersion: candidate.runtimeVersion,
    summary: candidate.summary,
  },
  summary: {
    regressions,
    improvements,
    stable,
    successRateDelta:
      candidate.summary.successRate -
      baseline.summary.successRate,
  },
  comparisons,
}

mkdirSync(reportDirectory, {
  recursive: true,
})

const timestamp = report.generatedAt
  .replace(/[:.]/g, '-')
  .replace('T', '_')
  .replace('Z', '')

const outputPath = resolve(
  reportDirectory,
  `runtime-evaluation-comparison-${timestamp}.json`,
)

writeFileSync(
  outputPath,
  `${JSON.stringify(report, null, 2)}\n`,
)

console.log('Runtime evaluation comparison report generated.')
console.log(`Report: ${outputPath}`)
console.log(JSON.stringify(report, null, 2))

if (regressions > 0) {
  process.exitCode = 1
}
