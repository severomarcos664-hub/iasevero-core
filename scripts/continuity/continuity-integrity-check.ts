import {
  createHash,
} from 'node:crypto'
import {
  readFileSync,
} from 'node:fs'
import {
  resolve,
} from 'node:path'
import {
  execFileSync,
} from 'node:child_process'

export type ContinuityIntegrityIssue = {
  code: string
  detail: string
}

export type ContinuityIntegrityReport = {
  valid: boolean

  baseline: {
    branch: string
    tag: string
    commit: string
    tagCommit: string | null
    headCommit: string | null
    baselineIsAncestorOfHead: boolean
  }

  continuityPack: {
    requiredFilesPresent: boolean
    requiredFiles: string[]
  }

  technologyRegistry: {
    sourceHashValid: boolean
    technologyCount: number
    expectedTechnologyCount: number
    statusesValid: boolean
    statusCounts: Record<string, number>
    roadmapImpliesImplementation: boolean
  }

  issues: ContinuityIntegrityIssue[]
}

type RuntimeBaselineManifest = {
  runtimeBaseline: {
    branch: string
    tag: string
    commit: string
  }
}

type AdvancedTechnologyRecord = {
  id: string
  section: number
  name: string
  category: string | null
  status:
    | 'PROVED'
    | 'PARTIALLY_PROVED'
    | 'FOUNDATION'
    | 'ROADMAP'
}

type AdvancedTechnologyManifest = {
  schemaVersion: number
  kind: string

  authority: {
    source: string
    sourceSha256: string
    generatedFromCanonicalDocument: boolean
    manualStatusOverrideAllowed: boolean
  }

  runtimeBaseline: {
    branch: string
    tag: string
    commit: string
  }

  claimGovernance: {
    allowedStatuses: string[]
    roadmapImpliesImplementation: boolean
  }

  summary: {
    technologyCount: number
    statusCounts: Record<string, number>
  }

  technologies: AdvancedTechnologyRecord[]
}

const ALLOWED_STATUSES = new Set([
  'PROVED',
  'PARTIALLY_PROVED',
  'FOUNDATION',
  'ROADMAP',
])

const EXPECTED_TECHNOLOGY_COUNT = 52

const REQUIRED_CONTINUITY_FILES = [
  'docs/architecture/continuity/current-baseline.json',
  'docs/architecture/continuity/MASTER-CONTINUITY.md',
  'docs/architecture/continuity/ARCHITECTURE-LEDGER.md',
  'docs/architecture/continuity/VERSION-LEDGER.md',
  'docs/architecture/continuity/ADVANCED-TECHNOLOGY-ROADMAP.md',
  'docs/architecture/continuity/advanced-technologies.json',
] as const

function readUtf8(
  repositoryRoot: string,
  relativePath: string,
): string {
  return readFileSync(
    resolve(repositoryRoot, relativePath),
    'utf8',
  )
}

function readJson<T>(
  repositoryRoot: string,
  relativePath: string,
): T {
  return JSON.parse(
    readUtf8(repositoryRoot, relativePath),
  ) as T
}

function sha256(value: string): string {
  return createHash('sha256')
    .update(value)
    .digest('hex')
}

function git(
  repositoryRoot: string,
  args: string[],
): string {
  return execFileSync(
    'git',
    args,
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: [
        'ignore',
        'pipe',
        'pipe',
      ],
    },
  ).trim()
}

function safeGit(
  repositoryRoot: string,
  args: string[],
): string | null {
  try {
    return git(repositoryRoot, args)
  } catch {
    return null
  }
}

function issue(
  issues: ContinuityIntegrityIssue[],
  code: string,
  detail: string,
): void {
  issues.push({
    code,
    detail,
  })
}

export function validateContinuityIntegrity(
  repositoryRoot = process.cwd(),
): ContinuityIntegrityReport {
  const issues: ContinuityIntegrityIssue[] = []

  const missingFiles =
    REQUIRED_CONTINUITY_FILES.filter(
      relativePath => {
        try {
          readUtf8(
            repositoryRoot,
            relativePath,
          )
          return false
        } catch {
          return true
        }
      },
    )

  if (missingFiles.length > 0) {
    issue(
      issues,
      'CONTINUITY_FILE_MISSING',
      missingFiles.join(','),
    )
  }

  let baseline: RuntimeBaselineManifest

  try {
    baseline =
      readJson<RuntimeBaselineManifest>(
        repositoryRoot,
        'docs/architecture/continuity/current-baseline.json',
      )
  } catch {
    baseline = {
      runtimeBaseline: {
        branch: '',
        tag: '',
        commit: '',
      },
    }

    issue(
      issues,
      'BASELINE_MANIFEST_INVALID',
      'current-baseline.json could not be parsed',
    )
  }

  let technologies: AdvancedTechnologyManifest

  try {
    technologies =
      readJson<AdvancedTechnologyManifest>(
        repositoryRoot,
        'docs/architecture/continuity/advanced-technologies.json',
      )
  } catch {
    technologies = {
      schemaVersion: 0,
      kind: '',
      authority: {
        source: '',
        sourceSha256: '',
        generatedFromCanonicalDocument: false,
        manualStatusOverrideAllowed: true,
      },
      runtimeBaseline: {
        branch: '',
        tag: '',
        commit: '',
      },
      claimGovernance: {
        allowedStatuses: [],
        roadmapImpliesImplementation: true,
      },
      summary: {
        technologyCount: 0,
        statusCounts: {},
      },
      technologies: [],
    }

    issue(
      issues,
      'TECHNOLOGY_MANIFEST_INVALID',
      'advanced-technologies.json could not be parsed',
    )
  }

  const baselineTag =
    baseline.runtimeBaseline.tag

  const baselineCommit =
    baseline.runtimeBaseline.commit

  const baselineBranch =
    baseline.runtimeBaseline.branch

  const tagCommit =
    baselineTag
      ? safeGit(
          repositoryRoot,
          [
            'rev-list',
            '-n',
            '1',
            baselineTag,
          ],
        )
      : null

  if (
    !tagCommit ||
    tagCommit !== baselineCommit
  ) {
    issue(
      issues,
      'BASELINE_TAG_COMMIT_DRIFT',
      `manifest=${baselineCommit};git=${tagCommit ?? 'unresolved'}`,
    )
  }

  const headCommit =
    safeGit(
      repositoryRoot,
      [
        'rev-parse',
        'HEAD',
      ],
    )

  let baselineIsAncestorOfHead = false

  if (
    baselineCommit &&
    headCommit
  ) {
    try {
      execFileSync(
        'git',
        [
          'merge-base',
          '--is-ancestor',
          baselineCommit,
          headCommit,
        ],
        {
          cwd: repositoryRoot,
          stdio: 'ignore',
        },
      )

      baselineIsAncestorOfHead = true
    } catch {
      baselineIsAncestorOfHead = false
    }
  }

  if (!baselineIsAncestorOfHead) {
    issue(
      issues,
      'BASELINE_NOT_ANCESTOR_OF_HEAD',
      `baseline=${baselineCommit};head=${headCommit ?? 'unresolved'}`,
    )
  }

  if (
    technologies.runtimeBaseline.branch !==
      baselineBranch ||
    technologies.runtimeBaseline.tag !==
      baselineTag ||
    technologies.runtimeBaseline.commit !==
      baselineCommit
  ) {
    issue(
      issues,
      'TECHNOLOGY_BASELINE_DRIFT',
      'advanced technology manifest baseline differs from current-baseline.json',
    )
  }

  let technologySource = ''

  try {
    technologySource =
      readUtf8(
        repositoryRoot,
        technologies.authority.source,
      )
  } catch {
    issue(
      issues,
      'TECHNOLOGY_SOURCE_UNREADABLE',
      technologies.authority.source || 'missing-source',
    )
  }

  const calculatedSourceHash =
    technologySource
      ? sha256(technologySource)
      : ''

  const sourceHashValid =
    calculatedSourceHash !== '' &&
    calculatedSourceHash ===
      technologies.authority.sourceSha256

  if (!sourceHashValid) {
    issue(
      issues,
      'TECHNOLOGY_SOURCE_HASH_DRIFT',
      `manifest=${technologies.authority.sourceSha256};calculated=${calculatedSourceHash}`,
    )
  }

  const technologyCount =
    technologies.technologies.length

  if (
    technologyCount !==
    EXPECTED_TECHNOLOGY_COUNT
  ) {
    issue(
      issues,
      'TECHNOLOGY_COUNT_DRIFT',
      `expected=${EXPECTED_TECHNOLOGY_COUNT};actual=${technologyCount}`,
    )
  }

  if (
    technologies.summary.technologyCount !==
    technologyCount
  ) {
    issue(
      issues,
      'TECHNOLOGY_SUMMARY_COUNT_DRIFT',
      `summary=${technologies.summary.technologyCount};actual=${technologyCount}`,
    )
  }

  const technologyIds =
    technologies.technologies.map(
      technology => technology.id,
    )

  if (
    new Set(technologyIds).size !==
    technologyIds.length
  ) {
    issue(
      issues,
      'DUPLICATE_TECHNOLOGY_ID',
      'technology IDs must be unique',
    )
  }

  const technologySections =
    technologies.technologies.map(
      technology => technology.section,
    )

  if (
    new Set(technologySections).size !==
    technologySections.length
  ) {
    issue(
      issues,
      'DUPLICATE_TECHNOLOGY_SECTION',
      'technology sections must be unique',
    )
  }

  const statusesValid =
    technologies.technologies.every(
      technology =>
        ALLOWED_STATUSES.has(
          technology.status,
        ),
    )

  if (!statusesValid) {
    issue(
      issues,
      'INVALID_TECHNOLOGY_STATUS',
      'one or more technology statuses are outside the governed enum',
    )
  }

  const actualStatusCounts:
    Record<string, number> = {
      PROVED: 0,
      PARTIALLY_PROVED: 0,
      FOUNDATION: 0,
      ROADMAP: 0,
    }

  for (
    const technology
    of technologies.technologies
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        actualStatusCounts,
        technology.status,
      )
    ) {
      actualStatusCounts[
        technology.status
      ] += 1
    }
  }

  for (
    const status
    of Object.keys(actualStatusCounts)
  ) {
    const declared =
      technologies.summary
        .statusCounts[status] ?? 0

    const actual =
      actualStatusCounts[status]

    if (declared !== actual) {
      issue(
        issues,
        'TECHNOLOGY_STATUS_COUNT_DRIFT',
        `${status}:declared=${declared};actual=${actual}`,
      )
    }
  }

  if (
    technologies.claimGovernance
      .roadmapImpliesImplementation !== false
  ) {
    issue(
      issues,
      'ROADMAP_IMPLEMENTATION_GUARD_INVALID',
      'roadmapImpliesImplementation must remain false',
    )
  }

  if (
    technologies.authority
      .generatedFromCanonicalDocument !== true
  ) {
    issue(
      issues,
      'TECHNOLOGY_SOURCE_AUTHORITY_INVALID',
      'machine manifest must declare canonical source derivation',
    )
  }

  if (
    technologies.authority
      .manualStatusOverrideAllowed !== false
  ) {
    issue(
      issues,
      'MANUAL_STATUS_OVERRIDE_GUARD_INVALID',
      'manual status override must remain disabled',
    )
  }

  return {
    valid: issues.length === 0,

    baseline: {
      branch: baselineBranch,
      tag: baselineTag,
      commit: baselineCommit,
      tagCommit,
      headCommit,
      baselineIsAncestorOfHead,
    },

    continuityPack: {
      requiredFilesPresent:
        missingFiles.length === 0,

      requiredFiles: [
        ...REQUIRED_CONTINUITY_FILES,
      ],
    },

    technologyRegistry: {
      sourceHashValid,
      technologyCount,
      expectedTechnologyCount:
        EXPECTED_TECHNOLOGY_COUNT,
      statusesValid,
      statusCounts:
        actualStatusCounts,
      roadmapImpliesImplementation:
        technologies.claimGovernance
          .roadmapImpliesImplementation,
    },

    issues,
  }
}

if (require.main === module) {
  const report =
    validateContinuityIntegrity()

  console.log(
    JSON.stringify(
      report,
      null,
      2,
    ),
  )

  if (!report.valid) {
    process.exitCode = 1
  }
}
