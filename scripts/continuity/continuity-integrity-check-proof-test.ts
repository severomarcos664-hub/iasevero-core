import assert from 'node:assert/strict'
import {
  execFileSync,
} from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import {
  tmpdir,
} from 'node:os'
import {
  join,
} from 'node:path'

import {
  validateContinuityIntegrity,
} from './continuity-integrity-check'

const sourceRoot = process.cwd()

const continuityRelative =
  'docs/architecture/continuity'

const requiredFiles = [
  'current-baseline.json',
  'MASTER-CONTINUITY.md',
  'ARCHITECTURE-LEDGER.md',
  'VERSION-LEDGER.md',
  'ADVANCED-TECHNOLOGY-ROADMAP.md',
  'advanced-technologies.json',
]

function git(
  root: string,
  args: string[],
): string {
  return execFileSync(
    'git',
    args,
    {
      cwd: root,
      encoding: 'utf8',
      stdio: [
        'ignore',
        'pipe',
        'pipe',
      ],
    },
  ).trim()
}

function writeJson(
  path: string,
  value: unknown,
): void {
  writeFileSync(
    path,
    JSON.stringify(
      value,
      null,
      2,
    ) + '\n',
    'utf8',
  )
}

function hasIssue(
  report:
    ReturnType<typeof validateContinuityIntegrity>,
  code: string,
): boolean {
  return report.issues.some(
    issue => issue.code === code,
  )
}

const fixtureRoot =
  mkdtempSync(
    join(
      tmpdir(),
      'iasevero-continuity-proof-',
    ),
  )

const fixtureContinuity =
  join(
    fixtureRoot,
    continuityRelative,
  )

mkdirSync(
  fixtureContinuity,
  {
    recursive: true,
  },
)

try {
  for (const file of requiredFiles) {
    cpSync(
      join(
        sourceRoot,
        continuityRelative,
        file,
      ),
      join(
        fixtureContinuity,
        file,
      ),
    )
  }

  git(
    fixtureRoot,
    [
      'init',
      '-q',
    ],
  )

  git(
    fixtureRoot,
    [
      'config',
      'user.name',
      'IASevero Continuity Proof',
    ],
  )

  git(
    fixtureRoot,
    [
      'config',
      'user.email',
      'continuity-proof@local.invalid',
    ],
  )

  git(
    fixtureRoot,
    [
      'add',
      '.',
    ],
  )

  git(
    fixtureRoot,
    [
      'commit',
      '-q',
      '-m',
      'fixture baseline',
    ],
  )

  const fixtureCommit =
    git(
      fixtureRoot,
      [
        'rev-parse',
        'HEAD',
      ],
    )

  const fixtureTag =
    'fixture-continuity-baseline'

  const fixtureBranch =
    'fixture-operational-branch'

  git(
    fixtureRoot,
    [
      'tag',
      fixtureTag,
    ],
  )

  const baselinePath =
    join(
      fixtureContinuity,
      'current-baseline.json',
    )

  const technologyPath =
    join(
      fixtureContinuity,
      'advanced-technologies.json',
    )

  const roadmapPath =
    join(
      fixtureContinuity,
      'ADVANCED-TECHNOLOGY-ROADMAP.md',
    )

  const versionLedgerPath =
    join(
      fixtureContinuity,
      'VERSION-LEDGER.md',
    )

  const originalRoadmap =
    readFileSync(
      roadmapPath,
      'utf8',
    )

  const sourceBaseline =
    JSON.parse(
      readFileSync(
        baselinePath,
        'utf8',
      ),
    )

  const sourceTechnologies =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  const fixtureBaseline = {
    ...sourceBaseline,
    runtimeBaseline: {
      ...sourceBaseline.runtimeBaseline,
      branch: fixtureBranch,
      tag: fixtureTag,
      commit: fixtureCommit,
    },
  }

  const fixtureTechnologies = {
    ...sourceTechnologies,
    runtimeBaseline: {
      ...sourceTechnologies.runtimeBaseline,
      branch: fixtureBranch,
      tag: fixtureTag,
      commit: fixtureCommit,
    },
  }

  const restoreBaseline = (): void => {
    writeJson(
      baselinePath,
      JSON.parse(
        JSON.stringify(
          fixtureBaseline,
        ),
      ),
    )
  }

  const restoreTechnologies = (): void => {
    writeJson(
      technologyPath,
      JSON.parse(
        JSON.stringify(
          fixtureTechnologies,
        ),
      ),
    )
  }

  const restoreRoadmap = (): void => {
    writeFileSync(
      roadmapPath,
      originalRoadmap,
      'utf8',
    )
  }

  restoreBaseline()
  restoreTechnologies()
  restoreRoadmap()

  const positive =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    positive.valid,
    true,
  )

  assert.equal(
    positive.issues.length,
    0,
  )

  assert.equal(
    positive.baseline.tagCommit,
    fixtureCommit,
  )

  assert.equal(
    positive.baseline
      .baselineIsAncestorOfHead,
    true,
  )

  assert.equal(
    positive.technologyRegistry
      .sourceHashValid,
    true,
  )

  assert.equal(
    positive.technologyRegistry
      .technologyCount,
    52,
  )

  /*
   * Negative case 1:
   * canonical technology document changes
   * without manifest regeneration.
   */
  writeFileSync(
    roadmapPath,
    originalRoadmap +
      '\nUNAUTHORIZED_DRIFT\n',
    'utf8',
  )

  const sourceHashDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    sourceHashDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      sourceHashDrift,
      'TECHNOLOGY_SOURCE_HASH_DRIFT',
    ),
    true,
  )

  restoreRoadmap()

  /*
   * Negative case 2:
   * ROADMAP is incorrectly allowed
   * to imply implementation.
   */
  restoreTechnologies()

  const roadmapGuardManifest =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  roadmapGuardManifest
    .claimGovernance
    .roadmapImpliesImplementation = true

  writeJson(
    technologyPath,
    roadmapGuardManifest,
  )

  const roadmapGuardDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    roadmapGuardDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      roadmapGuardDrift,
      'ROADMAP_IMPLEMENTATION_GUARD_INVALID',
    ),
    true,
  )

  /*
   * Negative case 3:
   * manual status override becomes allowed.
   */
  restoreTechnologies()

  const manualOverrideManifest =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  manualOverrideManifest
    .authority
    .manualStatusOverrideAllowed = true

  writeJson(
    technologyPath,
    manualOverrideManifest,
  )

  const manualOverrideDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    manualOverrideDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      manualOverrideDrift,
      'MANUAL_STATUS_OVERRIDE_GUARD_INVALID',
    ),
    true,
  )

  /*
   * Negative case 4:
   * duplicate technology identity.
   */
  restoreTechnologies()

  const duplicateManifest =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  duplicateManifest
    .technologies[1]
    .id =
      duplicateManifest
        .technologies[0]
        .id

  writeJson(
    technologyPath,
    duplicateManifest,
  )

  const duplicateDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    duplicateDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      duplicateDrift,
      'DUPLICATE_TECHNOLOGY_ID',
    ),
    true,
  )

  /*
   * Negative case 5:
   * invalid governed claim state.
   */
  restoreTechnologies()

  const invalidStatusManifest =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  invalidStatusManifest
    .technologies[0]
    .status =
      'UNVERIFIED_STATE'

  writeJson(
    technologyPath,
    invalidStatusManifest,
  )

  const invalidStatusDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    invalidStatusDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      invalidStatusDrift,
      'INVALID_TECHNOLOGY_STATUS',
    ),
    true,
  )

  /*
   * Negative case 6:
   * declared status totals diverge
   * from actual records.
   */
  restoreTechnologies()

  const statusCountManifest =
    JSON.parse(
      readFileSync(
        technologyPath,
        'utf8',
      ),
    )

  statusCountManifest
    .summary
    .statusCounts
    .PROVED += 1

  writeJson(
    technologyPath,
    statusCountManifest,
  )

  const statusCountDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    statusCountDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      statusCountDrift,
      'TECHNOLOGY_STATUS_COUNT_DRIFT',
    ),
    true,
  )

  /*
   * Negative case 7:
   * baseline manifest no longer resolves
   * to the immutable tagged commit.
   */
  restoreTechnologies()
  restoreBaseline()

  const baselineDriftManifest =
    JSON.parse(
      readFileSync(
        baselinePath,
        'utf8',
      ),
    )

  baselineDriftManifest
    .runtimeBaseline
    .commit =
      '0'.repeat(40)

  writeJson(
    baselinePath,
    baselineDriftManifest,
  )

  const baselineDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    baselineDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      baselineDrift,
      'BASELINE_TAG_COMMIT_DRIFT',
    ),
    true,
  )

  /*
   * Negative case 8:
   * required continuity evidence disappears.
   */
  restoreBaseline()
  restoreTechnologies()

  rmSync(
    versionLedgerPath,
  )

  const missingFileDrift =
    validateContinuityIntegrity(
      fixtureRoot,
    )

  assert.equal(
    missingFileDrift.valid,
    false,
  )

  assert.equal(
    hasIssue(
      missingFileDrift,
      'CONTINUITY_FILE_MISSING',
    ),
    true,
  )

  const proof = {
    architecture:
      'governed-continuity-integrity',

    positive: {
      valid:
        positive.valid,

      baselineTagResolved:
        positive.baseline
          .tagCommit === fixtureCommit,

      baselineAncestor:
        positive.baseline
          .baselineIsAncestorOfHead,

      technologySourceHashValid:
        positive
          .technologyRegistry
          .sourceHashValid,

      technologyCount:
        positive
          .technologyRegistry
          .technologyCount,

      issues:
        positive.issues.length,
    },

    negative: {
      sourceHashDriftBlocked:
        hasIssue(
          sourceHashDrift,
          'TECHNOLOGY_SOURCE_HASH_DRIFT',
        ),

      roadmapImplementationDriftBlocked:
        hasIssue(
          roadmapGuardDrift,
          'ROADMAP_IMPLEMENTATION_GUARD_INVALID',
        ),

      manualStatusOverrideBlocked:
        hasIssue(
          manualOverrideDrift,
          'MANUAL_STATUS_OVERRIDE_GUARD_INVALID',
        ),

      duplicateTechnologyIdBlocked:
        hasIssue(
          duplicateDrift,
          'DUPLICATE_TECHNOLOGY_ID',
        ),

      invalidTechnologyStatusBlocked:
        hasIssue(
          invalidStatusDrift,
          'INVALID_TECHNOLOGY_STATUS',
        ),

      statusCountDriftBlocked:
        hasIssue(
          statusCountDrift,
          'TECHNOLOGY_STATUS_COUNT_DRIFT',
        ),

      baselineTagCommitDriftBlocked:
        hasIssue(
          baselineDrift,
          'BASELINE_TAG_COMMIT_DRIFT',
        ),

      missingContinuityFileBlocked:
        hasIssue(
          missingFileDrift,
          'CONTINUITY_FILE_MISSING',
        ),
    },

    isolation: {
      temporaryGitFixture:
        true,

      productionRepositoryMutation:
        false,
    },
  }

  console.log(
    JSON.stringify(
      proof,
      null,
      2,
    ),
  )
} finally {
  rmSync(
    fixtureRoot,
    {
      recursive: true,
      force: true,
    },
  )
}
