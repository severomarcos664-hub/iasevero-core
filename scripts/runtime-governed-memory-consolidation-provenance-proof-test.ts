import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'
import {
  runMemoryConsolidationWorker,
} from '../app/lib/runtime-core/runtime-memory-consolidation-worker'

const databasePath = join(
  tmpdir(),
  'iasevero-governed-memory-consolidation-provenance-proof.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const candidate = `${databasePath}${suffix}`

  if (existsSync(candidate)) {
    rmSync(candidate, { force: true })
  }
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-v283.8'
const userId = 'owner-v283.8'
const otherUserId = 'other-user-v283.8'
const executionKey = 'execution-v283.8'

try {
  const firstEvent = repository.appendEvent({
    eventId: 'event-v283.8-1',
    tenantId,
    userId,
    executionKey,
    eventType: 'message',
    payload: {
      content:
        'O usuário prefere respostas técnicas e verificáveis.',
    },
    source: 'runtime-v283.8-proof',
    sourceAuthority: 95,
    createdAt: '2026-07-17T17:45:00.000Z',
  })

  const secondEvent = repository.appendEvent({
    eventId: 'event-v283.8-2',
    tenantId,
    userId,
    executionKey,
    eventType: 'feedback',
    payload: {
      content:
        'O usuário reforçou preferência por respostas diretas.',
    },
    source: 'runtime-v283.8-proof',
    sourceAuthority: 90,
    createdAt: '2026-07-17T17:46:00.000Z',
  })

  const report = runMemoryConsolidationWorker(
    repository,
    {
      tenantId,
      userId,
      executionKey,
      mode: 'semantic',
      sourceAuthority: 95,
      confidence: 90,
    },
  )

  if (
    report.proposalCount !== 1 ||
    report.writeDecisions.length !== 1
  ) {
    throw new Error(
      'Expected one governed consolidation proposal.',
    )
  }

  const candidateMemories =
    repository.readActiveMemories({
      tenantId,
      userId,
      limit: 100,
      now: '2026-07-17T17:47:00.000Z',
    })

  if (candidateMemories.length !== 0) {
    throw new Error(
      'Consolidation proposal was activated without governance approval.',
    )
  }

  const writeDecision =
    report.writeDecisions[0]

  if (!writeDecision) {
    throw new Error(
      'Governed consolidation write decision was not produced.',
    )
  }

  const consolidatedMemory =
    writeDecision.memory

  if (!consolidatedMemory) {
    throw new Error(
      'Consolidated candidate memory was not returned by the Write Gate.',
    )
  }

  if (
    writeDecision.targetStatus !== 'candidate' ||
    consolidatedMemory.status !== 'candidate'
  ) {
    throw new Error(
      'Consolidated candidate memory was not persisted.',
    )
  }

  const provenance =
    consolidatedMemory.structuredPayload
      .consolidationProvenance as
      | Record<string, unknown>
      | undefined

  if (!provenance) {
    throw new Error(
      'Consolidation provenance manifest was not persisted.',
    )
  }

  const sourceEventIds =
    provenance.sourceEventIds as
      | string[]
      | undefined

  if (
    provenance.manifestVersion !== 1 ||
    provenance.mode !== 'semantic' ||
    provenance.sourceEventCount !== 2 ||
    provenance.reversible !== true ||
    provenance.requestedActivation !== false ||
    provenance.supersessionApplied !== false ||
    !Array.isArray(sourceEventIds) ||
    !sourceEventIds.includes(firstEvent.eventId) ||
    !sourceEventIds.includes(secondEvent.eventId)
  ) {
    throw new Error(
      'Persisted consolidation provenance manifest is incomplete.',
    )
  }

  if (
    consolidatedMemory.sourceEventIds.length !== 2 ||
    !consolidatedMemory.sourceEventIds.includes(
      firstEvent.eventId,
    ) ||
    !consolidatedMemory.sourceEventIds.includes(
      secondEvent.eventId,
    )
  ) {
    throw new Error(
      'Canonical sourceEventIds were not preserved.',
    )
  }

  const crossUserRead =
    repository.readMemoryById({
      tenantId,
      userId: otherUserId,
      memoryId: consolidatedMemory.memoryId,
    })

  if (crossUserRead) {
    throw new Error(
      'Cross-user consolidation provenance leakage detected.',
    )
  }

  const sameManifestId =
    provenance.manifestId ===
    [
      'consolidation',
      'semantic',
      firstEvent.eventId,
      secondEvent.eventId,
    ].join(':')

  if (!sameManifestId) {
    throw new Error(
      'Consolidation manifest identifier is not deterministic.',
    )
  }

  console.log(
    'Runtime governed memory consolidation provenance proof passed.',
  )

  console.log({
    proposalCount: report.proposalCount,
    candidatePersisted: true,
    activationBlocked: true,
    manifestVersion:
      provenance.manifestVersion,
    sourceEventCount:
      provenance.sourceEventCount,
    sourceEventsPreserved: true,
    deterministicManifestId: true,
    reversible:
      provenance.reversible,
    supersessionApplied:
      provenance.supersessionApplied,
    crossUserLeakage: false,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
