import assert from 'node:assert/strict'

import {
  createControlledLoopbackEndpointProcessBinding,
  type ControlledLoopbackEndpointProcessBindingInput,
} from '../app/lib/runtime-execution-plane/runtime-controlled-loopback-endpoint-process-binding'

const matching = createControlledLoopbackEndpointProcessBinding({
  expectedProcessId: 424242,
  observedProcessId: 424242,
  host: '127.0.0.1',
  port: 3000,
})

assert.equal(matching.schemaVersion, 1)
assert.equal(
  matching.kind,
  'iasevero-controlled-loopback-endpoint-process-binding',
)

assert.equal(matching.expectedProcessId, 424242)
assert.equal(matching.observedProcessId, 424242)
assert.equal(matching.host, '127.0.0.1')
assert.equal(matching.port, 3000)

assert.equal(matching.processIdentityMatchObserved, true)
assert.equal(matching.physicalOwnershipVerificationEligible, true)

assert.equal(matching.physicalOwnershipVerified, false)
assert.equal(matching.readinessGranted, false)
assert.equal(matching.livenessGranted, false)
assert.equal(matching.runtimeAuthorityGranted, false)
assert.equal(matching.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(matching), true)

const mismatching = createControlledLoopbackEndpointProcessBinding({
  expectedProcessId: 424242,
  observedProcessId: 424243,
  host: '127.0.0.1',
  port: 3000,
})

assert.equal(mismatching.processIdentityMatchObserved, false)
assert.equal(
  mismatching.physicalOwnershipVerificationEligible,
  false,
)
assert.equal(mismatching.physicalOwnershipVerified, false)

assert.throws(
  () =>
    createControlledLoopbackEndpointProcessBinding({
      expectedProcessId: 0,
      observedProcessId: 424242,
      host: '127.0.0.1',
      port: 3000,
    }),
  /valid expectedProcessId/,
)

assert.throws(
  () =>
    createControlledLoopbackEndpointProcessBinding({
      expectedProcessId: 424242,
      observedProcessId: 0,
      host: '127.0.0.1',
      port: 3000,
    }),
  /valid observedProcessId/,
)

assert.throws(
  () =>
    createControlledLoopbackEndpointProcessBinding({
      expectedProcessId: 424242,
      observedProcessId: 424242,
      host: 'localhost',
      port: 3000,
    } as unknown as ControlledLoopbackEndpointProcessBindingInput),
  /permits only 127\.0\.0\.1/,
)

assert.throws(
  () =>
    createControlledLoopbackEndpointProcessBinding({
      expectedProcessId: 424242,
      observedProcessId: 424242,
      host: '127.0.0.1',
      port: 0,
    }),
  /valid bounded port/,
)

assert.throws(
  () =>
    createControlledLoopbackEndpointProcessBinding({
      expectedProcessId: 424242,
      observedProcessId: 424242,
      host: '127.0.0.1',
      port: 65536,
    }),
  /valid bounded port/,
)

console.log('MATCHING_PID_BINDING_ACCEPTED=TRUE')
console.log('PID_IDENTITY_MATCH_OBSERVED=TRUE')
console.log('PHYSICAL_OWNERSHIP_VERIFICATION_ELIGIBLE=TRUE')

console.log('MISMATCHING_PID_DETECTED=TRUE')
console.log('MISMATCHING_PID_PHYSICAL_VERIFICATION_ELIGIBLE=FALSE')

console.log('INVALID_EXPECTED_PID_REJECTED=TRUE')
console.log('INVALID_OBSERVED_PID_REJECTED=TRUE')
console.log('NON_LOOPBACK_HOST_REJECTED=TRUE')
console.log('INVALID_PORT_REJECTED=TRUE')

console.log('PHYSICAL_ENDPOINT_QUERY_EXECUTED=FALSE')
console.log('PHYSICAL_OWNERSHIP_VERIFIED=FALSE')
console.log('SOCKET_OPENED=FALSE')
console.log('HTTP_REQUEST_EXECUTED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_LOOPBACK_ENDPOINT_PROCESS_BINDING_FOUNDATION_FUNCTIONAL=PROVED',
)
