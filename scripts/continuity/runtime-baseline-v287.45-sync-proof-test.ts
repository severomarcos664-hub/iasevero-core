import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const expectedBranch = 'v276-runtime-cognitive-kernel'
const expectedTag =
  'v287.45-governed-execution-bound-authority-proof'
const expectedCommit =
  'e3fa1b0352a1e4e147a9f9889113099e26f05b40'

const baseline = JSON.parse(
  readFileSync(
    'docs/architecture/continuity/current-baseline.json',
    'utf8',
  ),
)

const technologies = JSON.parse(
  readFileSync(
    'docs/architecture/continuity/advanced-technologies.json',
    'utf8',
  ),
)

for (const [name, document] of [
  ['current-baseline', baseline],
  ['advanced-technologies', technologies],
] as const) {
  assert.equal(
    document.runtimeBaseline.branch,
    expectedBranch,
    `${name}: runtime baseline branch mismatch`,
  )

  assert.equal(
    document.runtimeBaseline.tag,
    expectedTag,
    `${name}: runtime baseline tag mismatch`,
  )

  assert.equal(
    document.runtimeBaseline.commit,
    expectedCommit,
    `${name}: runtime baseline commit mismatch`,
  )
}

assert.equal(
  baseline.runtimeBaseline.relationshipToContinuityHead,
  'ancestor-or-equal',
  'current-baseline: continuity-head relationship must remain ancestor-or-equal',
)

assert.equal(
  technologies.runtimeBaseline.branch,
  baseline.runtimeBaseline.branch,
  'canonical runtime baseline branch identities diverged',
)

assert.equal(
  technologies.runtimeBaseline.tag,
  baseline.runtimeBaseline.tag,
  'canonical runtime baseline tag identities diverged',
)

assert.equal(
  technologies.runtimeBaseline.commit,
  baseline.runtimeBaseline.commit,
  'canonical runtime baseline commit identities diverged',
)

console.log('RUNTIME_BASELINE_V287_45_SYNC_PROOF_PASS')
