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

import {
  renewGovernedEvolutionMissionLease,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease-renewal'

const repositoryDir = mkdtempSync(
  join(
    tmpdir(),
    'iasevero-evolution-lease-renewal-proof-',
  ),
)

try {
  const missionId =
    'mission-v2877356-renewal-proof'

  const acquired =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          'runner-a-v2877356-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:20:00.000Z',
      },
    )

  assert.equal(acquired.acquired, true)

  if (!acquired.acquired) {
    throw new Error(
      'Renewal proof requires initial acquired lease.',
    )
  }

  const renewed =
    renewGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          acquired.lease.runnerId,
        leaseId:
          acquired.lease.leaseId,
        expectedLeaseSequence: 1,
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:20:20.000Z',
      },
    )

  assert.equal(
    renewed.previousLeaseSequence,
    1,
  )
  assert.equal(
    renewed.leaseSequence,
    2,
  )
  assert.equal(
    renewed.heartbeatAt,
    '2026-09-13T23:20:20.000Z',
  )
  assert.equal(
    renewed.expiresAt,
    '2026-09-13T23:21:20.000Z',
  )

  assert.equal(
    renewed.leaseOwnershipVerified,
    true,
  )
  assert.equal(
    renewed.leaseFreshnessVerified,
    true,
  )
  assert.equal(
    renewed.leaseRenewalApplied,
    true,
  )

  assert.equal(
    renewed.executionAuthorized,
    false,
  )
  assert.equal(
    renewed.networkAuthorityGranted,
    false,
  )
  assert.equal(
    renewed.sandboxAuthorityGranted,
    false,
  )
  assert.equal(
    renewed.productionMutationAllowed,
    false,
  )
  assert.equal(
    renewed.selfPromotionAllowed,
    false,
  )

  const persisted =
    readGovernedEvolutionMissionLease(
      repositoryDir,
      missionId,
    )

  assert.ok(persisted)

  assert.equal(
    persisted.leaseSequence,
    2,
  )
  assert.equal(
    persisted.expiresAt,
    renewed.expiresAt,
  )

  assert.throws(
    () =>
      renewGovernedEvolutionMissionLease(
        repositoryDir,
        {
          missionId,
          runnerId:
            'runner-b-v2877356-proof',
          leaseId:
            acquired.lease.leaseId,
          expectedLeaseSequence: 2,
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:20:30.000Z',
        },
      ),
    /requires continuous lease ownership/,
  )

  assert.throws(
    () =>
      renewGovernedEvolutionMissionLease(
        repositoryDir,
        {
          missionId,
          runnerId:
            acquired.lease.runnerId,
          leaseId:
            acquired.lease.leaseId,
          expectedLeaseSequence: 1,
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:20:30.000Z',
        },
      ),
    /requires current lease sequence/,
  )

  const expiredMissionId =
    'mission-v2877356-expired-proof'

  const expired =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId: expiredMissionId,
        runnerId:
          'runner-expired-v2877356-proof',
        leaseDurationMs: 10_000,
        now: '2026-09-13T23:30:00.000Z',
      },
    )

  assert.equal(expired.acquired, true)

  if (!expired.acquired) {
    throw new Error(
      'Expired renewal proof requires acquired lease.',
    )
  }

  assert.throws(
    () =>
      renewGovernedEvolutionMissionLease(
        repositoryDir,
        {
          missionId:
            expiredMissionId,
          runnerId:
            expired.lease.runnerId,
          leaseId:
            expired.lease.leaseId,
          expectedLeaseSequence: 1,
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:30:11.000Z',
        },
      ),
    /cannot renew an expired lease/,
  )

  console.log({
    architecture:
      'active-lease -> ownership-verification -> freshness-verification -> heartbeat-renewal -> monotonic-sequence -> zero-authority',
    missionId,
    runnerId:
      renewed.runnerId,
    previousLeaseSequence:
      renewed.previousLeaseSequence,
    leaseSequence:
      renewed.leaseSequence,
    heartbeatAt:
      renewed.heartbeatAt,
    leaseRenewalApplied:
      renewed.leaseRenewalApplied,
    wrongRunnerRejected: true,
    staleSequenceRejected: true,
    expiredLeaseRejected: true,
    executionAuthorized:
      renewed.executionAuthorized,
    networkAuthorityGranted:
      renewed.networkAuthorityGranted,
    sandboxAuthorityGranted:
      renewed.sandboxAuthorityGranted,
    productionMutationAllowed:
      renewed.productionMutationAllowed,
    selfPromotionAllowed:
      renewed.selfPromotionAllowed,
  })

  console.log(
    'Runtime governed evolution mission lease renewal foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
