import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const run = (command: string, args: string[]): string =>
  execFileSync(command, args, {
    encoding: 'utf8',
    env: process.env,
  }).trim()

const tests = [
  'runtime-response-evaluation-baseline-test.ts',
  'runtime-response-evaluation-negative-cases-test.ts',
  'runtime-response-evaluation-boundary-cases-test.ts',
  'runtime-response-evaluation-consistency-cases-test.ts',
]

const results = tests.map((test) => {
  const startedAt = Date.now()

  try {
    execFileSync(
      'npx',
      ['--no-install', 'tsx', resolve('scripts', test)],
      {
        stdio: 'ignore',
        env: process.env,
      },
    )

    return {
      test,
      passed: true,
      durationMs: Date.now() - startedAt,
      error: null,
    }
  } catch (error) {
    return {
      test,
      passed: false,
      durationMs: Date.now() - startedAt,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown evaluation failure',
    }
  }
})

const passedCount = results.filter((result) => result.passed).length
const failedCount = results.length - passedCount

const gitTag = run('git', ['describe', '--tags', '--abbrev=0'])
const gitCommit = run('git', ['rev-parse', 'HEAD'])
const gitBranch = run('git', ['branch', '--show-current'])

const generatedAt = new Date().toISOString()
const timestamp = generatedAt
  .replace(/[:.]/g, '-')
  .replace('T', '_')
  .replace('Z', '')

const report = {
  schemaVersion: 'v1',
  source: 'runtime-response-evaluation-versioned-report',
  generatedAt,
  runtimeVersion: {
    tag: gitTag,
    commit: gitCommit,
    branch: gitBranch,
  },
  summary: {
    testCount: results.length,
    passedCount,
    failedCount,
    successRate:
      results.length === 0
        ? 0
        : Math.round((passedCount / results.length) * 100),
  },
  results,
}

const outputDirectory = resolve(
  'runtime',
  'evaluation-reports',
)

mkdirSync(outputDirectory, {
  recursive: true,
})

const outputPath = resolve(
  outputDirectory,
  `runtime-evaluation-${timestamp}.json`,
)

writeFileSync(
  outputPath,
  `${JSON.stringify(report, null, 2)}\n`,
)

console.log('Runtime response evaluation versioned report generated.')
console.log(`Report: ${outputPath}`)
console.log(JSON.stringify(report, null, 2))

if (failedCount > 0) {
  process.exitCode = 1
}
