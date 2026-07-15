import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

const databasePath = join(
  tmpdir(),
  'iasevero-enterprise-memory-foundation-test.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const path = `${databasePath}${suffix}`

  if (existsSync(path)) {
    rmSync(path, { force: true })
  }
}

const tenantId = 'tenant-test'
const userA = 'user-a'
const userB = 'user-b'
const executionKey = 'v282.1-memory-foundation-test'

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const event = repository.appendEvent({
  tenantId,
  userId: userA,
  executionKey,
  eventType: 'message',
  payload: {
    message: 'O usuário prefere respostas técnicas.',
  },
  source: 'runtime-enterprise-memory-test',
  sourceAuthority: 80,
})

if (!event.checksum || event.sequence < 1) {
  throw new Error('Append-only event persistence failed.')
}

const memoryV1 = repository.createMemory({
  tenantId,
  userId: userA,
  executionKey,
  type: 'semantic',
  content: 'O usuário prefere respostas técnicas.',
  structuredPayload: {
    preference: 'technical-responses',
  },
  source: 'runtime-enterprise-memory-test',
  sourceEventIds: [event.eventId],
  sourceAuthority: 80,
  confidence: 85,
  status: 'active',
  policyTags: ['preference'],
})

const memoryV2 = repository.createMemory({
  tenantId,
  userId: userA,
  executionKey,
  type: 'semantic',
  content:
    'O usuário prefere respostas técnicas, diretas e verificáveis.',
  structuredPayload: {
    preference: 'technical-direct-verifiable',
  },
  source: 'runtime-enterprise-memory-test',
  sourceEventIds: [event.eventId],
  sourceAuthority: 90,
  confidence: 95,
  status: 'active',
  supersedesMemoryId: memoryV1.memoryId,
  policyTags: ['preference'],
})

if (memoryV2.version !== 2) {
  throw new Error(
    `Expected version 2, received ${memoryV2.version}.`,
  )
}

const previous = repository.readMemoryById({
  tenantId,
  userId: userA,
  memoryId: memoryV1.memoryId,
})

if (previous?.status !== 'superseded') {
  throw new Error(
    'Previous memory was not marked as superseded.',
  )
}

const activeForUserA = repository.readActiveMemories({
  tenantId,
  userId: userA,
})

if (
  activeForUserA.length !== 1 ||
  activeForUserA[0]?.memoryId !== memoryV2.memoryId
) {
  throw new Error(
    'Active memory retrieval returned an invalid version.',
  )
}

const activeForUserB = repository.readActiveMemories({
  tenantId,
  userId: userB,
})

if (activeForUserB.length !== 0) {
  throw new Error(
    'Cross-user memory isolation failed.',
  )
}

repository.close()

const recoveredRepository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const recovered = recoveredRepository.readActiveMemories({
  tenantId,
  userId: userA,
})

if (
  recovered.length !== 1 ||
  recovered[0]?.memoryId !== memoryV2.memoryId ||
  recovered[0]?.version !== 2
) {
  throw new Error(
    'Memory did not survive repository restart.',
  )
}

recoveredRepository.close()

console.log(
  'Runtime enterprise cognitive memory repository test passed.',
)

console.log({
  databasePath,
  eventSequence: event.sequence,
  eventChecksum: event.checksum,
  originalMemoryId: memoryV1.memoryId,
  activeMemoryId: memoryV2.memoryId,
  activeVersion: memoryV2.version,
  recoveredCount: recovered.length,
  crossUserLeakage: 0,
  persistenceAfterRestart: true,
})

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}
