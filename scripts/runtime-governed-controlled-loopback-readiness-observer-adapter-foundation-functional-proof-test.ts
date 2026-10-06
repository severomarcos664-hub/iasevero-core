import assert from 'node:assert/strict'

import {
  createControlledLoopbackReadinessObserverAdapter,
  type ControlledLoopbackReadinessObserverAdapterInput,
} from '../app/lib/runtime-execution-plane/runtime-controlled-loopback-readiness-observer-adapter'

const valid = createControlledLoopbackReadinessObserverAdapter({
  processId: 424242,
  host: '127.0.0.1',
  port: 3000,
  timeoutMs: 1000,
})

assert.equal(valid.schemaVersion, 1)
assert.equal(
  valid.kind,
  'iasevero-controlled-loopback-readiness-observer-adapter',
)

assert.equal(valid.processId, 424242)
assert.equal(valid.host, '127.0.0.1')
assert.equal(valid.port, 3000)
assert.equal(valid.timeoutMs, 1000)

assert.equal(valid.loopbackOnly, true)
assert.equal(valid.redirectAllowed, false)
assert.equal(valid.internetAllowed, false)

assert.equal(valid.observationApplied, false)
assert.equal(valid.readinessGranted, false)
assert.equal(valid.livenessGranted, false)
assert.equal(valid.runtimeAuthorityGranted, false)
assert.equal(valid.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(valid), true)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 0,
      host: '127.0.0.1',
      port: 3000,
      timeoutMs: 1000,
    }),
  /valid positive processId/,
)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 424242,
      host: 'localhost',
      port: 3000,
      timeoutMs: 1000,
    } as unknown as ControlledLoopbackReadinessObserverAdapterInput),
  /permits only 127\.0\.0\.1/,
)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 424242,
      host: '127.0.0.1',
      port: 0,
      timeoutMs: 1000,
    }),
  /valid bounded port/,
)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 424242,
      host: '127.0.0.1',
      port: 65536,
      timeoutMs: 1000,
    }),
  /valid bounded port/,
)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 424242,
      host: '127.0.0.1',
      port: 3000,
      timeoutMs: 0,
    }),
  /bounded timeoutMs/,
)

assert.throws(
  () =>
    createControlledLoopbackReadinessObserverAdapter({
      processId: 424242,
      host: '127.0.0.1',
      port: 3000,
      timeoutMs: 5001,
    }),
  /bounded timeoutMs/,
)

console.log('VALID_LOOPBACK_CONTRACT_ACCEPTED=TRUE')
console.log('INVALID_PROCESS_ID_REJECTED=TRUE')
console.log('NON_LOOPBACK_HOST_REJECTED=TRUE')
console.log('INVALID_PORT_REJECTED=TRUE')
console.log('INVALID_TIMEOUT_REJECTED=TRUE')
console.log('REDIRECT_ALLOWED=FALSE')
console.log('INTERNET_ALLOWED=FALSE')
console.log('OBSERVATION_APPLIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')
console.log('REAL_LOOPBACK_CONNECTION_EXECUTED=FALSE')
console.log('CONTROLLED_LOOPBACK_READINESS_OBSERVER_FOUNDATION_FUNCTIONAL=PROVED')
