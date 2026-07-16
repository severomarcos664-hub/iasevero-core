import { join } from 'node:path'
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import {
  buildGovernedMemoryContextText,
  type GovernedMemoryContext,
} from '../app/lib/iasevero-core'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'
import {
  retrieveHybridEnterpriseMemories,
} from '../app/lib/runtime-core/runtime-hybrid-memory-retrieval'

const databasePath = join(
  tmpdir(),
  'iasevero-memory-applied-generation-test.sqlite',
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

const tenantId = 'tenant-generation-integration'
const userId = 'user-generation-owner'
const otherUserId = 'user-generation-other'
const userWithoutMemory = 'user-generation-empty'
const now = '2026-07-15T22:00:00.000Z'

try {
  const ownerMemory = repository.createMemory({
    tenantId,
    userId,
    entityId: 'project-preference',
    executionKey: 'generation-integration-test',
    type: 'semantic',
    content:
      'O projeto principal do usuário é a plataforma IASevero.',
    structuredPayload: {
      project: 'IASevero',
      purpose: 'governed-cognitive-platform',
    },
    source:
      'runtime-memory-applied-generation-integration-test',
    sourceAuthority: 96,
    confidence: 98,
    observedAt: '2026-07-15T20:00:00.000Z',
    validFrom: '2026-07-15T20:00:00.000Z',
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: [
      'project',
      'generation-context',
    ],
  })

  repository.createMemory({
    tenantId,
    userId: otherUserId,
    entityId: 'private-other-user-memory',
    executionKey: 'generation-integration-test',
    type: 'semantic',
    content:
      'CONTEÚDO PRIVADO DE OUTRO USUÁRIO.',
    structuredPayload: {
      scenario: 'cross-user-isolation',
    },
    source:
      'runtime-memory-applied-generation-integration-test',
    sourceAuthority: 100,
    confidence: 100,
    observedAt: '2026-07-15T20:00:00.000Z',
    validFrom: '2026-07-15T20:00:00.000Z',
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: [
      'private',
      'cross-user-test',
    ],
  })

  const ownerRetrieval =
    retrieveHybridEnterpriseMemories(
      repository,
      {
        tenantId,
        userId,
        query:
          'Qual é o projeto principal do usuário?',
        types: ['semantic'],
        limit: 6,
        candidateLimit: 100,
        minimumScore: 20,
        now,
      },
    )

  if (ownerRetrieval.selectedCount < 1) {
    throw new Error(
      'Relevant owner memory was not selected.',
    )
  }

  if (
    !ownerRetrieval.results.some(
      ({ memory }) =>
        memory.memoryId === ownerMemory.memoryId,
    )
  ) {
    throw new Error(
      'Expected owner memory was not ranked.',
    )
  }

  if (
    ownerRetrieval.results.some(
      ({ memory }) =>
        memory.userId !== userId,
    )
  ) {
    throw new Error(
      'Cross-user memory leakage was detected.',
    )
  }

  const governedContext: GovernedMemoryContext = {
    source:
      'runtime-enterprise-cognitive-memory',
    tenantId,
    userId,
    query:
      'Qual é o projeto principal do usuário?',
    selectedCount:
      ownerRetrieval.selectedCount,
    rejectedCount:
      ownerRetrieval.rejectedCount,
    grounded:
      ownerRetrieval.selectedCount > 0,
    items: ownerRetrieval.results.map(
      ({ memory, score }) => ({
        memoryId: memory.memoryId,
        type: memory.type,
        content: memory.content,
        source: memory.source,
        sourceAuthority:
          memory.sourceAuthority,
        confidence: memory.confidence,
        observedAt: memory.observedAt,
        score: score.total,
      }),
    ),
    reasoning: ownerRetrieval.reasoning,
  }

  const generationContext =
    buildGovernedMemoryContextText(
      governedContext,
    )

  if (
    !generationContext.includes('IASevero')
  ) {
    throw new Error(
      'Relevant memory did not enter generation context.',
    )
  }

  if (
    generationContext.includes(
      'CONTEÚDO PRIVADO DE OUTRO USUÁRIO',
    )
  ) {
    throw new Error(
      'Other-user memory entered generation context.',
    )
  }

  const emptyRetrieval =
    retrieveHybridEnterpriseMemories(
      repository,
      {
        tenantId,
        userId: userWithoutMemory,
        query:
          'Qual é o projeto principal do usuário?',
        types: ['semantic'],
        limit: 6,
        candidateLimit: 100,
        minimumScore: 20,
        now,
      },
    )

  if (emptyRetrieval.selectedCount !== 0) {
    throw new Error(
      'User without memory received a memory context.',
    )
  }

  const emptyGenerationContext =
    buildGovernedMemoryContextText()

  if (emptyGenerationContext !== '') {
    throw new Error(
      'Absent memory must preserve the normal generation path.',
    )
  }

  console.log(
    'Runtime memory applied generation integration test passed.',
  )

  console.log({
    ownerMemorySelected: true,
    generationContextApplied: true,
    emptyUserPreserved: true,
    crossUserLeakage: false,
    selectedCount:
      ownerRetrieval.selectedCount,
    rejectedCount:
      ownerRetrieval.rejectedCount,
    grounded: governedContext.grounded,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
