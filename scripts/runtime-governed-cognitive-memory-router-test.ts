import {
  registerRuntimeMemoryEvent,
} from '@/app/lib/orchestrator/runtime-operational-memory'
import {
  routeGovernedCognitiveMemory,
} from '@/app/lib/runtime-core/runtime-governed-cognitive-memory-router'

const now = new Date().toISOString()

registerRuntimeMemoryEvent({
  id: 'memory-governance-001',
  type: 'governance-policy',
  timestamp: now,
  severity: 'high',
  message:
    'A execução externa exige autorização explícita da governança.',
  source: 'runtime-governance',
  payload: {
    subject: 'external-execution',
    value: 'requires-authorization',
  },
})

registerRuntimeMemoryEvent({
  id: 'memory-conflict-001',
  type: 'user-context',
  timestamp: now,
  severity: 'low',
  message:
    'A execução externa pode ocorrer sem autorização.',
  source: 'user-context',
  payload: {
    subject: 'external-execution',
    value: 'no-authorization-required',
  },
})

registerRuntimeMemoryEvent({
  id: 'memory-operational-001',
  type: 'runtime-execution',
  timestamp: now,
  severity: 'medium',
  message:
    'A executionKey preserva a identidade da execução entre chamadas.',
  source: 'runtime-operational-memory',
  payload: {
    subject: 'execution-key',
    value: 'persistent-identity',
  },
})

registerRuntimeMemoryEvent({
  id: 'memory-irrelevant-001',
  type: 'unrelated-information',
  timestamp: now,
  severity: 'low',
  message:
    'Registro sem relação com governança ou execução.',
  source: 'informational',
  payload: {
    subject: 'unrelated',
    value: 'ignored',
  },
})

const report = routeGovernedCognitiveMemory({
  query:
    'A execução externa precisa de autorização da governança?',
  maxSelected: 3,
})

const selectedIds = report.selected.map(
  (candidate) => candidate.event.id,
)

const rejectedByAuthority = report.rejected.find(
  (candidate) =>
    candidate.event.id === 'memory-conflict-001' &&
    candidate.rejectionReason ===
      'superseded-by-authority',
)

const governanceConflict = report.conflicts.find(
  (conflict) =>
    conflict.key === 'external-execution' &&
    conflict.winnerEventId === 'memory-governance-001',
)

if (!selectedIds.includes('memory-governance-001')) {
  throw new Error(
    'Governance memory was not selected.',
  )
}

if (!rejectedByAuthority) {
  throw new Error(
    'Conflicting lower-authority memory was not rejected.',
  )
}

if (!governanceConflict) {
  throw new Error(
    'Governance conflict was not detected or resolved.',
  )
}

if (report.aggregateConfidence < 60) {
  throw new Error(
    `Aggregate confidence is too low: ${report.aggregateConfidence}`,
  )
}

if (!report.grounded) {
  throw new Error(
    'Governed memory report should be grounded.',
  )
}

console.log(
  'Runtime governed cognitive memory router test passed.',
)
console.log(JSON.stringify(report, null, 2))
