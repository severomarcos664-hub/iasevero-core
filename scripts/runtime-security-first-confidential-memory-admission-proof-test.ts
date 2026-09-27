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
  'iasevero-v287-76-confidential-memory-admission-proof.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const candidatePath = `${databasePath}${suffix}`
  if (existsSync(candidatePath)) {
    rmSync(candidatePath, { force: true })
  }
}

const repository = new RuntimeEnterpriseCognitiveMemoryRepository(
  databasePath,
)

const common = {
  tenantId: 'v287-76-tenant',
  userId: 'v287-76-user',
  executionKey: 'v287-76-confidential-memory-admission',
  type: 'semantic' as const,
  structuredPayload: {
    category: 'security-first-confidential-memory',
  },
  source: 'v287-76-security-first-proof',
  sourceEventIds: [],
  sourceAuthority: 90,
  confidence: 95,
  policyTags: ['confidential'],
}

try {
  const unauthorized = evaluateGovernedMemoryWrite(
    repository,
    {
      ...common,
      content:
        'Confidential governed memory requiring explicit sensitive-memory authorization.',
      requestedActivation: true,
    },
  )

  if (unauthorized.writeAllowed !== false) {
    throw new Error(
      'Unauthorized confidential memory must not be write-allowed.',
    )
  }

  if (
    unauthorized.decision !== 'rejected' ||
    unauthorized.targetStatus !== 'rejected'
  ) {
    throw new Error(
      'Unauthorized confidential memory must fail closed as rejected.',
    )
  }

  const authorized = evaluateGovernedMemoryWrite(
    repository,
    {
      ...common,
      content:
        'Confidential governed memory with explicit sensitive-memory authorization.',
      allowSensitiveMemory: true,
      requestedActivation: true,
    },
  )

  if (!authorized.writeAllowed) {
    throw new Error(
      'Authorized confidential memory should remain write-eligible.',
    )
  }

  if (authorized.sensitivity !== 'confidential') {
    throw new Error(
      'Authorized confidential memory must preserve confidential classification.',
    )
  }

  if (
    authorized.retentionPolicy !==
    'confidential-controlled-retention'
  ) {
    throw new Error(
      'Authorized confidential memory must preserve controlled retention.',
    )
  }

  console.log(
    'V287_76_SECURITY_FIRST_CONFIDENTIAL_MEMORY_ADMISSION_PROOF=PASS',
  )
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, { force: true })
  }
}
