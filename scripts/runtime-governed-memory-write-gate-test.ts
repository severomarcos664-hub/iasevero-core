import { existsSync, rmSync } from 'node:fs'
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
  'iasevero-governed-memory-write-gate-test.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const candidatePath = `${databasePath}${suffix}`

  if (existsSync(candidatePath)) {
    rmSync(candidatePath, {
      force: true,
    })
  }
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const common = {
  tenantId: 'tenant-write-gate',
  userId: 'user-write-gate',
  executionKey: 'v282.2-write-gate-test',
  type: 'semantic' as const,
  structuredPayload: {
    category: 'preference',
  },
  source: 'runtime-governed-memory-write-gate-test',
  sourceEventIds: [],
  policyTags: ['preference'],
}

const acceptedActive = evaluateGovernedMemoryWrite(
  repository,
  {
    ...common,
    content:
      'O usuário prefere respostas técnicas, diretas e verificáveis.',
    sourceAuthority: 90,
    confidence: 95,
    requestedActivation: true,
  },
)

if (
  !acceptedActive.writeAllowed ||
  acceptedActive.targetStatus !== 'active' ||
  !acceptedActive.memory
) {
  throw new Error(
    'High-confidence memory should have been activated.',
  )
}

const duplicate = evaluateGovernedMemoryWrite(
  repository,
  {
    ...common,
    content:
      'O usuário prefere respostas técnicas, diretas e verificáveis.',
    sourceAuthority: 90,
    confidence: 95,
    requestedActivation: true,
  },
)

if (
  duplicate.writeAllowed ||
  !duplicate.duplicateDetected ||
  duplicate.duplicateSimilarity !== 100
) {
  throw new Error(
    'Exact duplicate should have been rejected.',
  )
}

const lowConfidence = evaluateGovernedMemoryWrite(
  repository,
  {
    ...common,
    content:
      'Talvez o usuário goste de respostas com muitos exemplos.',
    sourceAuthority: 60,
    confidence: 20,
  },
)

if (
  lowConfidence.writeAllowed ||
  lowConfidence.targetStatus !== 'rejected'
) {
  throw new Error(
    'Low-confidence memory should have been rejected.',
  )
}

const restricted = evaluateGovernedMemoryWrite(
  repository,
  {
    ...common,
    content:
      'A senha privada informada para o serviço é exemplo-secreto.',
    sourceAuthority: 95,
    confidence: 95,
    requestedActivation: true,
  },
)

if (
  restricted.writeAllowed ||
  restricted.sensitivity !== 'restricted'
) {
  throw new Error(
    'Unauthorized restricted memory should have been rejected.',
  )
}

const candidate = evaluateGovernedMemoryWrite(
  repository,
  {
    ...common,
    content:
      'O usuário pode preferir relatórios técnicos com conclusão executiva.',
    sourceAuthority: 55,
    confidence: 65,
    requestedActivation: true,
  },
)

if (
  !candidate.writeAllowed ||
  candidate.targetStatus !== 'candidate' ||
  !candidate.memory
) {
  throw new Error(
    'Moderate-evidence memory should have been stored as candidate.',
  )
}

const otherUserMemories =
  repository.readActiveMemories({
    tenantId: common.tenantId,
    userId: 'different-user',
  })

if (otherUserMemories.length !== 0) {
  throw new Error(
    'Cross-user isolation failed in the Write Gate test.',
  )
}

repository.close()

console.log(
  'Runtime governed memory write gate test passed.',
)

console.log({
  activeMemoryId: acceptedActive.memory.memoryId,
  activeStatus: acceptedActive.targetStatus,
  duplicateRejected: !duplicate.writeAllowed,
  duplicateSimilarity:
    duplicate.duplicateSimilarity,
  lowConfidenceRejected:
    !lowConfidence.writeAllowed,
  restrictedRejected:
    !restricted.writeAllowed,
  candidateStatus: candidate.targetStatus,
  crossUserLeakage: 0,
})

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}
