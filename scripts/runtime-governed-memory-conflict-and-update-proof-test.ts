import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'
import {
  evaluateGovernedMemoryWrite,
} from '../app/lib/runtime-core/runtime-governed-memory-write-gate'

const databasePath = join(
  tmpdir(),
  'iasevero-governed-memory-conflict-update-proof.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, { force: true })
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const common = {
  tenantId: 'tenant-conflict-proof',
  userId: 'user-owner',
  executionKey: 'v283.3-conflict-proof',
  type: 'semantic' as const,
  source: 'runtime-governed-memory-conflict-proof',
  sourceEventIds: [],
  policyTags: ['project', 'conflict-proof'],
}

try {
  const original = evaluateGovernedMemoryWrite(
    repository,
    {
      ...common,
      content:
        'O projeto principal do usuário é o Projeto A.',
      structuredPayload: {
        category: 'project',
        subject: 'primary-project',
        value: 'project-a',
      },
      sourceAuthority: 95,
      confidence: 95,
      requestedActivation: true,
    },
  )

  if (
    !original.writeAllowed ||
    original.targetStatus !== 'active' ||
    !original.memory
  ) {
    throw new Error(
      'Original memory was not activated.',
    )
  }

  const updated = evaluateGovernedMemoryWrite(
    repository,
    {
      ...common,
      content:
        'O projeto principal do usuário agora é a IASevero.',
      structuredPayload: {
        category: 'project',
        subject: 'primary-project',
        value: 'iasevero',
      },
      sourceAuthority: 98,
      confidence: 98,
      requestedActivation: true,
    },
  )

  if (
    !updated.writeAllowed ||
    updated.targetStatus !== 'active' ||
    !updated.conflictDetected ||
    updated.conflictingMemoryId !==
      original.memory.memoryId ||
    updated.supersedesMemoryId !==
      original.memory.memoryId ||
    !updated.memory
  ) {
    throw new Error(
      'Conflicting update was not applied correctly.',
    )
  }

  const previous = repository.readMemoryById({
    tenantId: common.tenantId,
    userId: common.userId,
    memoryId: original.memory.memoryId,
  })

  const activeOwner =
    repository.readActiveMemories({
      tenantId: common.tenantId,
      userId: common.userId,
    })

  if (
    previous?.status !== 'superseded' ||
    activeOwner.length !== 1 ||
    activeOwner[0]?.memoryId !==
      updated.memory.memoryId ||
    !activeOwner[0]?.content.includes('IASevero')
  ) {
    throw new Error(
      'Supersedence state is inconsistent.',
    )
  }

  const unrelated = evaluateGovernedMemoryWrite(
    repository,
    {
      ...common,
      content:
        'A linguagem preferida do usuário é TypeScript.',
      structuredPayload: {
        category: 'project',
        subject: 'preferred-language',
        value: 'typescript',
      },
      sourceAuthority: 98,
      confidence: 98,
      requestedActivation: true,
    },
  )

  if (
    !unrelated.writeAllowed ||
    unrelated.conflictDetected ||
    unrelated.supersedesMemoryId
  ) {
    throw new Error(
      'Different subject was incorrectly treated as conflict.',
    )
  }

  const otherUser =
    repository.readActiveMemories({
      tenantId: common.tenantId,
      userId: 'different-user',
    })

  if (otherUser.length !== 0) {
    throw new Error(
      'Cross-user memory isolation failed.',
    )
  }

  console.log(
    'Runtime governed memory conflict and update proof passed.',
  )

  console.log({
    conflictDetected:
      updated.conflictDetected,
    conflictingMemoryIdMatches:
      updated.conflictingMemoryId ===
      original.memory.memoryId,
    previousMemoryStatus:
      previous.status,
    updatedMemoryStatus:
      updated.memory.status,
    activeOwnerMemoryCount:
      activeOwner.length,
    selectedUpdatedValue:
      activeOwner[0]?.content.includes('IASevero'),
    unrelatedSubjectConflict:
      Boolean(unrelated.conflictDetected),
    crossUserLeakage:
      otherUser.length !== 0,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
