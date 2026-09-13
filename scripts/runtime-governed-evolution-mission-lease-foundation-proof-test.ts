import assert from 'node:assert/strict'
import {
  mkdtempSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  acquireGovernedEvolutionMissionLease,
  readGovernedEvolutionMissionLease,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease'

const repositoryDir = mkdtempSync(
  join(
    tmpdir(),
    'iasevero-evolution-mission-lease-proof-',
  ),
)

try {
  const missionId =
    'mission-v2877355-single-runner-proof'

  const first =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          'runner-a-v2877355-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:15:00.000Z',
      },
    )

  assert.equal(first.acquired, true)

  if (!first.acquired) {
    throw new Error(
      'First mission runner must acquire lease.',
    )
  }

  assert.equal(
    first.lease.executionAuthorized,
    false,
  )
  assert.equal(
    first.lease.networkAuthorityGranted,
    false,
  )
  assert.equal(
    first.lease.sandboxAuthorityGranted,
    false,
  )
  assert.equal(
    first.lease.productionMutationAllowed,
    false,
  )
  assert.equal(
    first.lease.selfPromotionAllowed,
    false,
  )

  const restored =
    readGovernedEvolutionMissionLease(
      repositoryDir,
      missionId,
    )

  assert.ok(restored)

  assert.equal(
    restored.leaseId,
    first.lease.leaseId,
  )

  assert.equal(
    restored.runnerId,
    'runner-a-v2877355-proof',
  )

  const competing =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          'runner-b-v2877355-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:15:10.000Z',
      },
    )

  assert.equal(
    competing.acquired,
    false,
  )

  assert.equal(
    competing.reason,
    'mission-already-leased',
  )

  assert.equal(
    competing.lease.leaseId,
    first.lease.leaseId,
  )

  assert.equal(
    competing.lease.runnerId,
    'runner-a-v2877355-proof',
  )

  assert.throws(
    () =>
      acquireGovernedEvolutionMissionLease(
        repositoryDir,
        {
          missionId:
            'mission-invalid-duration',
          runnerId:
            'runner-invalid-duration',
          leaseDurationMs: 0,
        },
      ),
    /requires positive integer leaseDurationMs/,
  )

  console.log({
    architecture:
      'mission -> atomic-exclusive-lease -> single-runner -> contention-blocked -> zero-authority',
    missionId,
    firstRunner:
      first.lease.runnerId,
    firstLeaseAcquired:
      first.acquired,
    competingRunnerBlocked:
      competing.acquired === false,
    existingLeasePreserved:
      competing.lease.leaseId ===
      first.lease.leaseId,
    executionAuthorized:
      first.lease.executionAuthorized,
    networkAuthorityGranted:
      first.lease.networkAuthorityGranted,
    sandboxAuthorityGranted:
      first.lease.sandboxAuthorityGranted,
    productionMutationAllowed:
      first.lease.productionMutationAllowed,
    selfPromotionAllowed:
      first.lease.selfPromotionAllowed,
  })

  console.log(
    'Runtime governed evolution mission single-runner lease foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
