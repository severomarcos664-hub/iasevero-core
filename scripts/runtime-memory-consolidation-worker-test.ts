import { rmSync } from 'node:fs'
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
  'iasevero-memory-consolidation-worker-test.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-consolidation'
const userId = 'user-consolidation'
const otherUserId = 'other-user'
const executionKey =
  'v282.4-consolidation-test'

repository.appendEvent({
  tenantId,
  userId,
  executionKey,
  eventType: 'message',
  payload: {
    message:
      'O usuário prefere respostas técnicas.',
  },
  source: 'consolidation-test',
  sourceAuthority: 85,
})

repository.appendEvent({
  tenantId,
  userId,
  executionKey,
  eventType: 'decision',
  payload: {
    decision:
      'Aplicar resposta direta e verificável.',
  },
  source: 'consolidation-test',
  sourceAuthority: 90,
})

repository.appendEvent({
  tenantId,
  userId,
  executionKey,
  eventType: 'execution',
  payload: {
    action:
      'Executar validação TypeScript.',
  },
  source: 'consolidation-test',
  sourceAuthority: 90,
})

repository.appendEvent({
  tenantId,
  userId,
  executionKey,
  eventType: 'result',
  payload: {
    result:
      'Validação TypeScript aprovada.',
  },
  source: 'consolidation-test',
  sourceAuthority: 95,
})

repository.appendEvent({
  tenantId,
  userId: otherUserId,
  executionKey,
  eventType: 'message',
  payload: {
    message:
      'Evento pertencente a outro usuário.',
  },
  source: 'consolidation-test',
  sourceAuthority: 100,
})

const episodic =
  runMemoryConsolidationWorker(
    repository,
    {
      tenantId,
      userId,
      executionKey,
      mode: 'episodic',
      sourceAuthority: 85,
      confidence: 80,
    },
  )

if (
  episodic.eventCount !== 4 ||
  episodic.proposalCount !== 1
) {
  throw new Error(
    'Episodic consolidation produced an invalid result.',
  )
}

if (
  episodic.writeDecisions[0]
    ?.targetStatus !== 'candidate'
) {
  throw new Error(
    'Consolidation worker must persist proposals as candidates.',
  )
}

const semantic =
  runMemoryConsolidationWorker(
    repository,
    {
      tenantId,
      userId,
      executionKey,
      mode: 'semantic',
      sourceAuthority: 80,
      confidence: 75,
    },
  )

if (
  semantic.proposalCount !== 1 ||
  semantic.proposals[0]
    ?.memoryType !== 'semantic'
) {
  throw new Error(
    'Semantic consolidation proposal was not created.',
  )
}

const procedural =
  runMemoryConsolidationWorker(
    repository,
    {
      tenantId,
      userId,
      executionKey,
      mode: 'procedural',
      sourceAuthority: 90,
      confidence: 85,
    },
  )

if (
  procedural.proposalCount !== 1 ||
  procedural.proposals[0]
    ?.memoryType !== 'procedural'
) {
  throw new Error(
    'Procedural consolidation proposal was not created.',
  )
}

const otherUserReport =
  runMemoryConsolidationWorker(
    repository,
    {
      tenantId,
      userId: otherUserId,
      executionKey,
      mode: 'episodic',
    },
  )

if (
  otherUserReport.eventCount !== 1 ||
  otherUserReport.proposalCount !== 0
) {
  throw new Error(
    'Cross-user event isolation failed.',
  )
}

const activeMemories =
  repository.readActiveMemories({
    tenantId,
    userId,
  })

if (activeMemories.length !== 0) {
  throw new Error(
    'Consolidation worker activated memory without governance approval.',
  )
}

repository.close()

console.log(
  'Runtime memory consolidation worker test passed.',
)

console.log({
  episodicProposalCount:
    episodic.proposalCount,
  semanticProposalCount:
    semantic.proposalCount,
  proceduralProposalCount:
    procedural.proposalCount,
  candidateOnly:
    episodic.writeDecisions[0]
      ?.targetStatus === 'candidate',
  unauthorizedActivation: 0,
  crossUserLeakage: 0,
})

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}
