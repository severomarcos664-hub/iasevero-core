import assert from 'node:assert/strict'

import {
  observeControlledPhysicalProcessIncarnation,
} from '../app/lib/runtime-execution-plane/runtime-controlled-physical-process-incarnation-observer'

const observation =
  observeControlledPhysicalProcessIncarnation({
    processId: 424242,
    bootId: 'fixture-boot-id-0001',
    processStartTicks: 123456789,
  })

assert.equal(observation.schemaVersion, 1)
assert.equal(
  observation.kind,
  'iasevero-controlled-physical-process-incarnation-observation',
)

assert.equal(observation.processId, 424242)
assert.equal(observation.bootId, 'fixture-boot-id-0001')
assert.equal(observation.processStartTicks, 123456789)

assert.equal(observation.processIncarnationObserved, true)
assert.equal(observation.processIncarnationVerified, false)

assert.equal(observation.readinessGranted, false)
assert.equal(observation.livenessGranted, false)
assert.equal(observation.runtimeAuthorityGranted, false)
assert.equal(observation.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(observation), true)

assert.throws(
  () =>
    observeControlledPhysicalProcessIncarnation({
      processId: 0,
      bootId: 'fixture-boot-id-0001',
      processStartTicks: 123,
    }),
  /valid processId/,
)

assert.throws(
  () =>
    observeControlledPhysicalProcessIncarnation({
      processId: 1,
      bootId: '   ',
      processStartTicks: 123,
    }),
  /non-empty bootId/,
)

assert.throws(
  () =>
    observeControlledPhysicalProcessIncarnation({
      processId: 1,
      bootId: 'fixture-boot-id-0001',
      processStartTicks: -1,
    }),
  /valid processStartTicks/,
)

assert.throws(
  () =>
    observeControlledPhysicalProcessIncarnation({
      processId: 1,
      bootId: 'fixture-boot-id-0001',
      processStartTicks: Number.MAX_SAFE_INTEGER + 1,
    }),
  /valid processStartTicks/,
)

console.log('VALID_CONTROLLED_OBSERVATION_ACCEPTED=TRUE')
console.log('INVALID_PROCESS_ID_REJECTED=TRUE')
console.log('EMPTY_BOOT_ID_REJECTED=TRUE')
console.log('INVALID_PROCESS_START_TICKS_REJECTED=TRUE')
console.log('OBSERVATION_IMMUTABLE=TRUE')

console.log('PROCESS_INCARNATION_OBSERVED=TRUE')
console.log('PROCESS_INCARNATION_VERIFIED=FALSE')

console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_PHYSICAL_PROCESS_INCARNATION_OBSERVER_FOUNDATION_FUNCTIONAL=PROVED',
)
