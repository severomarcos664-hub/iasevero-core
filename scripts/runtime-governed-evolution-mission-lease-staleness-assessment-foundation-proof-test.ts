import assert from 'node:assert/strict'
import {
  mkdtempSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  acquireGovernedEvolutionMissionLease,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease'

import {
  assessGovernedEvolutionMissionLeaseStaleness,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease-staleness-assessment'

const repositoryDir = mkdtempSync(
  join(
    tmpdir(),
    'iasevero-evolution-lease-staleness-proof-',
  ),
)

try {
  const missionId =
    'mission-v2877357-staleness-proof'

  const acquired =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          'runner-v2877357-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:40:00.000Z',
      },
    )

  assert.equal(acquired.acquired, true)

  if (!acquired.acquired) {
    throw new Error(
      'Staleness proof requires an acquired lease.',
    )
  }

  const fresh =
    assessGovernedEvolutionMissionLeaseStaleness(
      repositoryDir,
      {
        missionId,
        warningThresholdMs: 15_000,
        now: '2026-09-13T23:40:10.000Z',
      },
    )

  assert.equal(fresh.temporalStatus, 'fresh')
  assert.equal(fresh.remainingMs, 50_000)
  assert.equal(fresh.leaseFresh, true)
  assert.equal(fresh.leaseNearExpiry, false)
  assert.equal(fresh.leaseExpired, false)

  const nearExpiry =
    assessGovernedEvolutionMissionLeaseStaleness(
      repositoryDir,
      {
        missionId,
        warningThresholdMs: 15_000,
        now: '2026-09-13T23:40:50.000Z',
      },
    )

  assert.equal(
    nearExpiry.temporalStatus,
    'near-expiry',
  )
  assert.equal(
    nearExpiry.remainingMs,
    10_000,
  )
  assert.equal(
    nearExpiry.leaseFresh,
    false,
  )
  assert.equal(
    nearExpiry.leaseNearExpiry,
    true,
  )
  assert.equal(
    nearExpiry.leaseExpired,
    false,
  )

  const expired =
    assessGovernedEvolutionMissionLeaseStaleness(
      repositoryDir,
      {
        missionId,
        warningThresholdMs: 15_000,
        now: '2026-09-13T23:41:01.000Z',
      },
    )

  assert.equal(
    expired.temporalStatus,
    'expired',
  )
  assert.equal(
    expired.remainingMs,
    -1_000,
  )
  assert.equal(
    expired.leaseFresh,
    false,
  )
  assert.equal(
    expired.leaseNearExpiry,
    false,
  )
  assert.equal(
    expired.leaseExpired,
    true,
  )

  assert.equal(
    expired.ownershipTransferAuthorized,
    false,
  )
  assert.equal(
    expired.executionAuthorized,
    false,
  )
  assert.equal(
    expired.networkAuthorityGranted,
    false,
  )
  assert.equal(
    expired.sandboxAuthorityGranted,
    false,
  )
  assert.equal(
    expired.productionMutationAllowed,
    false,
  )
  assert.equal(
    expired.selfPromotionAllowed,
    false,
  )

  assert.throws(
    () =>
      assessGovernedEvolutionMissionLeaseStaleness(
        repositoryDir,
        {
          missionId,
          warningThresholdMs: 15_000,
          now: '2026-09-13T23:39:59.000Z',
        },
      ),
    /rejects regressive observation time/,
  )

  assert.throws(
    () =>
      assessGovernedEvolutionMissionLeaseStaleness(
        repositoryDir,
        {
          missionId,
          warningThresholdMs: 0,
        },
      ),
    /requires positive warningThresholdMs/,
  )

  console.log({
    architecture:
      'canonical-lease -> temporal-observation -> fresh|near-expiry|expired -> evidence-only -> no-takeover-authority',
    missionId,
    runnerId: expired.runnerId,
    leaseSequence:
      expired.leaseSequence,

    freshStatus:
      fresh.temporalStatus,
    freshRemainingMs:
      fresh.remainingMs,

    nearExpiryStatus:
      nearExpiry.temporalStatus,
    nearExpiryRemainingMs:
      nearExpiry.remainingMs,

    expiredStatus:
      expired.temporalStatus,
    expiredRemainingMs:
      expired.remainingMs,

    regressiveTimeRejected: true,

    ownershipTransferAuthorized:
      expired.ownershipTransferAuthorized,
    executionAuthorized:
      expired.executionAuthorized,
    networkAuthorityGranted:
      expired.networkAuthorityGranted,
    sandboxAuthorityGranted:
      expired.sandboxAuthorityGranted,
    productionMutationAllowed:
      expired.productionMutationAllowed,
    selfPromotionAllowed:
      expired.selfPromotionAllowed,
  })

  console.log(
    'Runtime governed evolution mission lease staleness assessment foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
