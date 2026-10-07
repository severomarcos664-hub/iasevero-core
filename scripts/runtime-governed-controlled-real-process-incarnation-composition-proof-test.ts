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

const AUTHORIZATION_ENV =
  'IASEVERO_ALLOW_CONTROLLED_REAL_PROCESS_INCARNATION_COMPOSITION'

if (process.env[AUTHORIZATION_ENV] !== '1') {
  throw new Error(
    'Controlled real process incarnation composition requires explicit proof authorization.',
  )
}

const selfProcessId = process.pid

assert.equal(
  Number.isSafeInteger(selfProcessId) &&
    selfProcessId > 0,
  true,
)

const bootIdentity =
  observeControlledRealLinuxBootIdentity()

assert.equal(
  bootIdentity.physicalBootIdReadExecuted,
  true,
)

assert.equal(
  bootIdentity.realBootIdentityObservationRecorded,
  true,
)

assert.equal(
  typeof bootIdentity.bootId === 'string' &&
    bootIdentity.bootId.length > 0,
  true,
)

const startTicks =
  readControlledLinuxProcessStartTicks(
    selfProcessId,
  )

assert.equal(
  startTicks.processId,
  selfProcessId,
)

assert.equal(
  startTicks.sourcePath,
  `/proc/${selfProcessId}/stat`,
)

assert.equal(
  startTicks.processStartTicksRead,
  true,
)

assert.equal(
  Number.isSafeInteger(startTicks.processStartTicks) &&
    startTicks.processStartTicks > 0,
  true,
)

const physicalObservation =
  observeControlledPhysicalProcessIncarnation({
    processId: selfProcessId,
    bootId: bootIdentity.bootId,
    processStartTicks:
      startTicks.processStartTicks,
  })

assert.equal(
  physicalObservation.processId,
  selfProcessId,
)

assert.equal(
  physicalObservation.bootId,
  bootIdentity.bootId.trim(),
)

assert.equal(
  physicalObservation.processStartTicks,
  startTicks.processStartTicks,
)

assert.equal(
  physicalObservation.processIncarnationVerified,
  false,
)

assert.equal(
  physicalObservation.readinessGranted,
  false,
)

assert.equal(
  physicalObservation.livenessGranted,
  false,
)

assert.equal(
  physicalObservation.runtimeAuthorityGranted,
  false,
)

assert.equal(
  physicalObservation.networkAuthorityGranted,
  false,
)

assert.equal(
  Object.isFrozen(physicalObservation),
  true,
)

const incarnationEvidence =
  createControlledProcessIncarnationEvidence({
    processId:
      physicalObservation.processId,
    bootId:
      physicalObservation.bootId,
    processStartTicks:
      physicalObservation.processStartTicks,
  })

assert.equal(
  incarnationEvidence.processId,
  selfProcessId,
)

assert.equal(
  incarnationEvidence.bootId,
  bootIdentity.bootId.trim(),
)

assert.equal(
  incarnationEvidence.processStartTicks,
  startTicks.processStartTicks,
)

assert.equal(
  incarnationEvidence.processIncarnationEvidenceRecorded,
  true,
)

assert.equal(
  incarnationEvidence.processIncarnationVerified,
  false,
)

assert.equal(
  incarnationEvidence.readinessGranted,
  false,
)

assert.equal(
  incarnationEvidence.livenessGranted,
  false,
)

assert.equal(
  incarnationEvidence.runtimeAuthorityGranted,
  false,
)

assert.equal(
  incarnationEvidence.networkAuthorityGranted,
  false,
)

assert.equal(
  Object.isFrozen(incarnationEvidence),
  true,
)

const incarnationDigest =
  createHash('sha256')
    .update(
      [
        String(selfProcessId),
        bootIdentity.bootId,
        String(startTicks.processStartTicks),
      ].join(':'),
      'utf8',
    )
    .digest('hex')

assert.match(
  incarnationDigest,
  /^[0-9a-f]{64}$/,
)

console.log(
  'CONTROLLED_REAL_PROCESS_INCARNATION_COMPOSITION=PROVED',
)

console.log(
  'SELF_PROCESS_ID_BOUND=TRUE',
)

console.log(
  'REAL_BOOT_ID_OBSERVATION_USED=TRUE',
)

console.log(
  'REAL_PROCESS_START_TICKS_OBSERVATION_USED=TRUE',
)

console.log(
  'CANONICAL_PHYSICAL_INCARNATION_OBSERVER_USED=TRUE',
)

console.log(
  'CANONICAL_PROCESS_INCARNATION_EVIDENCE_USED=TRUE',
)

console.log(
  'PROCESS_INCARNATION_EVIDENCE_RECORDED=TRUE',
)

console.log(
  `PROCESS_INCARNATION_SHA256=${incarnationDigest}`,
)

console.log(
  'RAW_BOOT_ID_DISCLOSED=FALSE',
)

console.log(
  'RAW_PROCESS_START_TICKS_DISCLOSED=FALSE',
)

console.log(
  'PROCESS_INCARNATION_VERIFIED=FALSE',
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
