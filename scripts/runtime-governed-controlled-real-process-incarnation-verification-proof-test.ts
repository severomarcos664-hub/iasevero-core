import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import {
  observeControlledRealLinuxBootIdentity,
} from '../app/lib/runtime-execution-plane/runtime-controlled-real-linux-boot-identity-observation'

import {
  readControlledLinuxProcessStartTicks,
} from '../app/lib/runtime-execution-plane/runtime-controlled-linux-process-start-ticks-reader'

import {
  observeControlledPhysicalProcessIncarnation,
} from '../app/lib/runtime-execution-plane/runtime-controlled-physical-process-incarnation-observer'

import {
  createControlledProcessIncarnationEvidence,
} from '../app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-evidence'

import {
  verifyControlledProcessIncarnationEvidence,
} from '../app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-verification-decision'

const AUTHORIZATION_ENV =
  'IASEVERO_ALLOW_CONTROLLED_REAL_PROCESS_INCARNATION_VERIFICATION'

if (process.env[AUTHORIZATION_ENV] !== '1') {
  throw new Error(
    'Controlled real process incarnation verification requires explicit proof authorization.',
  )
}

const selfProcessId = process.pid

assert.equal(
  Number.isSafeInteger(selfProcessId) &&
    selfProcessId > 0,
  true,
)

function capturePhysicalIncarnation() {
  const boot =
    observeControlledRealLinuxBootIdentity()

  assert.equal(
    boot.physicalBootIdReadExecuted,
    true,
  )

  assert.equal(
    boot.realBootIdentityObservationRecorded,
    true,
  )

  const start =
    readControlledLinuxProcessStartTicks(
      selfProcessId,
    )

  assert.equal(start.processId, selfProcessId)
  assert.equal(start.processStartTicksRead, true)

  const physical =
    observeControlledPhysicalProcessIncarnation({
      processId: selfProcessId,
      bootId: boot.bootId,
      processStartTicks:
        start.processStartTicks,
    })

  assert.equal(
    physical.processIncarnationVerified,
    false,
  )

  assert.equal(physical.readinessGranted, false)
  assert.equal(physical.livenessGranted, false)
  assert.equal(
    physical.runtimeAuthorityGranted,
    false,
  )
  assert.equal(
    physical.networkAuthorityGranted,
    false,
  )

  const evidence =
    createControlledProcessIncarnationEvidence({
      processId: physical.processId,
      bootId: physical.bootId,
      processStartTicks:
        physical.processStartTicks,
    })

  assert.equal(
    evidence.processIncarnationEvidenceRecorded,
    true,
  )

  assert.equal(
    evidence.processIncarnationVerified,
    false,
  )

  return Object.freeze({
    processId: evidence.processId,
    bootId: evidence.bootId,
    processStartTicks:
      evidence.processStartTicks,
    evidence,
  })
}

const first =
  capturePhysicalIncarnation()

const second =
  capturePhysicalIncarnation()

assert.equal(
  first.processId,
  second.processId,
)

assert.equal(
  first.bootId,
  second.bootId,
)

assert.equal(
  first.processStartTicks,
  second.processStartTicks,
)

const decision =
  verifyControlledProcessIncarnationEvidence({
    expected: {
      processId: first.processId,
      bootId: first.bootId,
      processStartTicks:
        first.processStartTicks,
    },
    evidence: second.evidence,
  })

assert.equal(
  decision.verificationEvaluated,
  true,
)

assert.equal(
  decision.identityMatched,
  true,
)

assert.equal(
  decision.processIncarnationVerified,
  true,
)

assert.equal(
  decision.readinessGranted,
  false,
)

assert.equal(
  decision.livenessGranted,
  false,
)

assert.equal(
  decision.runtimeAuthorityGranted,
  false,
)

assert.equal(
  decision.networkAuthorityGranted,
  false,
)

assert.equal(Object.isFrozen(decision), true)

const firstDigest =
  createHash('sha256')
    .update(
      [
        String(first.processId),
        first.bootId,
        String(first.processStartTicks),
      ].join(':'),
      'utf8',
    )
    .digest('hex')

const secondDigest =
  createHash('sha256')
    .update(
      [
        String(second.processId),
        second.bootId,
        String(second.processStartTicks),
      ].join(':'),
      'utf8',
    )
    .digest('hex')

assert.equal(firstDigest, secondDigest)

console.log(
  'CONTROLLED_REAL_PROCESS_INCARNATION_VERIFICATION=PROVED',
)

console.log(
  'FIRST_PHYSICAL_INCARNATION_OBSERVATION=TRUE',
)

console.log(
  'SECOND_PHYSICAL_INCARNATION_OBSERVATION=TRUE',
)

console.log(
  'REAL_PROCESS_ID_STABLE=TRUE',
)

console.log(
  'REAL_BOOT_ID_STABLE=TRUE',
)

console.log(
  'REAL_PROCESS_START_TICKS_STABLE=TRUE',
)

console.log(
  'EXACT_PHYSICAL_IDENTITY_MATCH=TRUE',
)

console.log(
  'PROCESS_INCARNATION_VERIFIED=TRUE',
)

console.log(
  `PROCESS_INCARNATION_SHA256=${secondDigest}`,
)

console.log(
  'RAW_BOOT_ID_DISCLOSED=FALSE',
)

console.log(
  'RAW_PROCESS_START_TICKS_DISCLOSED=FALSE',
)

console.log(
  'READINESS_GRANTED=FALSE',
)

console.log(
  'LIVENESS_GRANTED=FALSE',
)

console.log(
  'RUNTIME_AUTHORITY_GRANTED=FALSE',
)

console.log(
  'NETWORK_AUTHORITY_GRANTED=FALSE',
)
