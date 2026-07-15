import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const tests = [
  'runtime-response-evaluation-baseline-test.ts',
  'runtime-response-evaluation-negative-cases-test.ts',
  'runtime-response-evaluation-boundary-cases-test.ts',
  'runtime-response-evaluation-consistency-cases-test.ts',
]

for (const test of tests) {
  const testPath = resolve('scripts', test)

  console.log(`\n=== Running ${test} ===`)

  execFileSync(
    'npx',
    ['--no-install', 'tsx', testPath],
    {
      stdio: 'inherit',
      env: process.env,
    },
  )
}

console.log('\nRuntime response evaluation regression suite passed.')
console.log(
  JSON.stringify(
    {
      source: 'runtime-response-evaluation-regression-suite',
      testCount: tests.length,
      passedCount: tests.length,
      failedCount: 0,
      tests,
    },
    null,
    2,
  ),
)
