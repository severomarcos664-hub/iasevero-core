import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const architectureLedger = readFileSync(
  'docs/architecture/continuity/ARCHITECTURE-LEDGER.md',
  'utf8',
)

const roadmap = readFileSync(
  'docs/architecture/continuity/ADVANCED-TECHNOLOGY-ROADMAP.md',
  'utf8',
)

const master = readFileSync(
  'docs/architecture/continuity/MASTER-CONTINUITY.md',
  'utf8',
)

const registry = JSON.parse(
  readFileSync(
    'docs/architecture/continuity/advanced-technologies.json',
    'utf8',
  ),
) as {
  technologies?: Array<{
    id?: string
    name?: string
    status?: string
    category?: string
    section?: string
  }>
}

const planes = [
  'Governed Intelligence Plane',
  'Governed Agent Control Plane',
  'Governed Context & Memory Continuity',
  'Governed Work Orchestration',
  'Governed Capability Discovery',
  'Sovereign Interaction & Execution Plane',
  'Evaluation & Evolution Plane',
]

const invariants = [
  'MODEL INTELLIGENCE != EXECUTION AUTHORITY',
  'LONG CONTEXT != MEMORY',
  'INTERNAL REASONING != GOVERNANCE EVIDENCE',
  'SELF-IMPROVEMENT WITHOUT SELF-PROMOTION',
  'providerAvailable != providerAuthorized != providerSelected != providerInvoked',
]

const existingOwners = [
  'dynamic-model-routing',
  'adaptive-cognitive-routing',
  'governed-multi-agent-architecture',
  'governed-autonomous-operation',
  'hierarchical-governed-memory',
  'durable-execution-journal',
  'governed-tool-execution',
  'controlled-external-read',
  'governed-evaluation-contract',
  'continual-learning-governance',
]

const umbrellaId =
  'governed-frontier-intelligence-agentic-control-evolution-architecture'

for (const plane of planes) {
  assert.ok(
    architectureLedger.includes(plane),
    `architecture ledger must define ${plane}`,
  )
}

for (const invariant of invariants) {
  assert.ok(
    architectureLedger.includes(invariant),
    `architecture ledger must preserve invariant: ${invariant}`,
  )
}

assert.ok(
  roadmap.includes(
    'Governed Frontier Intelligence, Agentic Control & Evolution Architecture',
  ),
  'roadmap must contain the frontier intelligence architecture',
)

assert.ok(
  master.includes(
    'Governed Frontier Intelligence, Agentic Control & Evolution Architecture',
  ),
  'master continuity must reference the architecture extension',
)

for (const owner of existingOwners) {
  assert.ok(
    architectureLedger.includes(owner) || roadmap.includes(owner),
    `canonical technology owner must be referenced: ${owner}`,
  )
}

const umbrella = registry.technologies?.find(
  technology => technology.id === umbrellaId,
)

assert.ok(
  umbrella,
  'machine-readable technology registry must contain the umbrella architecture',
)

assert.equal(
  umbrella?.status,
  'ROADMAP',
  'frontier architecture must remain ROADMAP until implementation proof exists',
)

const astraSpecificEntries =
  registry.technologies?.filter(technology =>
    String(technology.id).toLowerCase().includes('astra'),
  ) ?? []

assert.equal(
  astraSpecificEntries.length,
  0,
  'Astra must not create a parallel IASevero architecture or technology owner',
)

console.log({
  architecture:
    'governed-frontier-intelligence-agentic-control-evolution-protocol-extension',
  planeCount: planes.length,
  invariantCount: invariants.length,
  existingOwnerReferenceCount: existingOwners.length,
  umbrellaRegistered: Boolean(umbrella),
  umbrellaStatus: umbrella?.status ?? null,
  astraSpecificEntryCount: astraSpecificEntries.length,
  implementationClaimed: false,
  runtimeChanged: false,
  networkAccess: false,
  providerInvocation: false,
  executionApplied: false,
  mutationApplied: false,
})

console.log(
  'Runtime governed frontier intelligence agentic evolution protocol extension proof passed.',
)
