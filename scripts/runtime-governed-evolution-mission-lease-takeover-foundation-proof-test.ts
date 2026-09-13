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
  assessGovernedEvolutionMissionLeaseStaleness,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease-staleness-assessment'

import {
  takeoverGovernedEvolutionMissionLease,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease-takeover'

const repositoryDir = mkdtempSync(
  join(
    tmpdir(),
    'iasevero-evolution-lease-takeover-proof-',
  ),
)

try {
  const missionId =
    'mission-v2877358-takeover-proof'

  const acquired =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId:
          'runner-a-v2877358-proof',
        leaseDurationMs: 30_000,
        now: '2026-09-13T23:50:00.000Z',
      },
    )

  assert.equal(acquired.acquired, true)

  if (!acquired.acquired) {
    throw new Error(
      'Takeover proof requires initial lease.',
    )
  }

  const expired =
    assessGovernedEvolutionMissionLeaseStaleness(
      repositoryDir,
      {
        missionId,
        warningThresholdMs: 10_000,
        now: '2026-09-13T23:50:31.000Z',
      },
    )

  assert.equal(
    expired.temporalStatus,
    'expired',
  )

  const takeover =
    takeoverGovernedEvolutionMissionLease(
      repositoryDir,
      expired,
      {
        newRunnerId:
          'runner-b-v2877358-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:50:31.000Z',
      },
    )

  assert.equal(
    takeover.expiredAssessmentVerified,
    true,
  )
  assert.equal(
    takeover.currentLeaseRevalidated,
    true,
  )
  assert.equal(
    takeover.ownershipTransferApplied,
    true,
  )

  assert.equal(
    takeover.previousRunnerId,
    'runner-a-v2877358-proof',
  )
  assert.equal(
    takeover.runnerId,
    'runner-b-v2877358-proof',
  )

  assert.equal(
    takeover.previousLeaseSequence,
    1,
  )
  assert.equal(
    takeover.leaseSequence,
    2,
  )
  assert.equal(
    takeover.takeoverSequence,
    1,
  )

  assert.notEqual(
    takeover.leaseId,
    takeover.previousLeaseId,
  )

  const persisted =
    readGovernedEvolutionMissionLease(
      repositoryDir,
      missionId,
    )

  assert.ok(persisted)

  assert.equal(
    persisted.runnerId,
    takeover.runnerId,
  )
  assert.equal(
    persisted.leaseId,
    takeover.leaseId,
  )
  assert.equal(
    persisted.previousLeaseId,
    takeover.previousLeaseId,
  )
  assert.equal(
    persisted.previousRunnerId,
    takeover.previousRunnerId,
  )
  assert.equal(
    persisted.leaseSequence,
    2,
  )
  assert.equal(
    persisted.takeoverSequence,
    1,
  )

  assert.equal(
    takeover.executionAuthorized,
    false,
  )
  assert.equal(
    takeover.networkAuthorityGranted,
    false,
  )
  assert.equal(
    takeover.sandboxAuthorityGranted,
    false,
  )
  assert.equal(
    takeover.productionMutationAllowed,
    false,
  )
  assert.equal(
    takeover.selfPromotionAllowed,
    false,
  )

  const freshMissionId =
    'mission-v2877358-fresh-proof'

  const freshLease =
    acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId: freshMissionId,
        runnerId:
          'runner-fresh-v2877358-proof',
        leaseDurationMs: 60_000,
        now: '2026-09-13T23:55:00.000Z',
      },
    )

  assert.equal(
    freshLease.acquired,
    true,
  )

  const freshAssessment =
    assessGovernedEvolutionMissionLeaseStaleness(
      repositoryDir,
      {
        missionId: freshMissionId,
        warningThresholdMs: 10_000,
        now: '2026-09-13T23:55:10.000Z',
      },
    )

  assert.throws(
    () =>
      takeoverGovernedEvolutionMissionLease(
        repositoryDir,
        freshAssessment,
        {
          newRunnerId:
            'runner-c-v2877358-proof',
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:55:10.000Z',
        },
      ),
    /requires verified expired lease evidence/,
  )

  assert.throws(
    () =>
      takeoverGovernedEvolutionMissionLease(
        repositoryDir,
        expired,
        {
          newRunnerId:
            'runner-c-v2877358-proof',
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:50:32.000Z',
        },
      ),
    /requires unchanged expired lease identity/,
  )

  console.log({
    architecture:
      'expired-evidence -> shared-exclusive-mutation-lock -> identity-revalidation -> expiry-revalidation -> atomic-takeover -> provenance -> zero-authority',

    missionId,

    previousRunnerId:
      takeover.previousRunnerId,
    runnerId:
      takeover.runnerId,

    previousLeaseSequence:
      takeover.previousLeaseSequence,
    leaseSequence:
      takeover.leaseSequence,
    takeoverSequence:
      takeover.takeoverSequence,

    leaseIdentityRotated:
      takeover.leaseId !==
      takeover.previousLeaseId,

    provenancePreserved:
      persisted.previousLeaseId ===
        takeover.previousLeaseId &&
      persisted.previousRunnerId ===
        takeover.previousRunnerId,

    freshLeaseTakeoverRejected: true,
    staleAssessmentReplayRejected: true,

    executionAuthorized:
      takeover.executionAuthorized,
    networkAuthorityGranted:
      takeover.networkAuthorityGranted,
    sandboxAuthorityGranted:
      takeover.sandboxAuthorityGranted,
    productionMutationAllowed:
      takeover.productionMutationAllowed,
    selfPromotionAllowed:
      takeover.selfPromotionAllowed,
  })

  console.log(
    'Runtime governed evolution mission lease takeover foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
