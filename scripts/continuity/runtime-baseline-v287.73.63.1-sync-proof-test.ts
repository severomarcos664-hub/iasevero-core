import assert from 'node:assert/strict'
import fs from 'node:fs'

const expectedTag =
  'v287.73.63-governed-sovereign-matrix-execution-plane-end-to-end-closure-proof'

const expectedCommit =
  'e476c7ecf67f649d8d91a46a2a149b4512b29b1'

const current = JSON.parse(
  fs.readFileSync(
    'docs/architecture/continuity/current-baseline.json',
    'utf8',
  ),
)

const advanced = JSON.parse(
  fs.readFileSync(
    'docs/architecture/continuity/advanced-technologies.json',
    'utf8',
  ),
)

const versionLedger =
  fs.readFileSync(
    'docs/architecture/continuity/VERSION-LEDGER.md',
    'utf8',
  )

const architectureLedger =
  fs.readFileSync(
    'docs/architecture/continuity/ARCHITECTURE-LEDGER.md',
    'utf8',
  )

assert.equal(
  current.runtimeBaseline.branch,
  'v276-runtime-cognitive-kernel',
)

assert.equal(
  advanced.runtimeBaseline.branch,
  'v276-runtime-cognitive-kernel',
)

assert.equal(current.runtimeBaseline.tag, expectedTag)
assert.equal(current.runtimeBaseline.commit, expectedCommit)

assert.equal(advanced.runtimeBaseline.tag, expectedTag)
assert.equal(advanced.runtimeBaseline.commit, expectedCommit)

assert.equal(
  current.claimGovernance.roadmapImpliesImplementation,
  false,
)

assert.equal(
  current.authority.gitIsSourceOfTruth,
  true,
)

assert.equal(
  advanced.claimGovernance.roadmapImpliesImplementation,
  false,
)

assert.equal(
  versionLedger.includes(
    'v287.73.63.1 - Governed Continuity Pack Sovereign Matrix Execution Plane Closure Sync Proof',
  ),
  true,
)

assert.equal(
  architectureLedger.includes(
    'v287.73.63.1 - Governed Sovereign Matrix Execution Plane Continuity Closure Sync',
  ),
  true,
)

assert.equal(versionLedger.includes(expectedTag), true)
assert.equal(versionLedger.includes(expectedCommit), true)

assert.equal(architectureLedger.includes(expectedTag), true)
assert.equal(architectureLedger.includes(expectedCommit), true)

console.log({
  architecture:
    'git-tag-commit -> current-baseline -> advanced-technology-registry -> version-ledger -> architecture-ledger -> continuity-sync',
  runtimeBaselineTag: current.runtimeBaseline.tag,
  runtimeBaselineCommit: current.runtimeBaseline.commit,
  currentBaselineSynchronized: true,
  advancedTechnologyRegistrySynchronized: true,
  versionLedgerSynchronized: true,
  architectureLedgerSynchronized: true,
  gitRemainsSourceOfTruth: true,
  roadmapImpliesImplementation: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
  executionApplied: false,
  mutationApplied: false,
  selfPromotionApplied: false,
})

console.log(
  'Runtime baseline v287.73.63.1 continuity synchronization proof passed.',
)
