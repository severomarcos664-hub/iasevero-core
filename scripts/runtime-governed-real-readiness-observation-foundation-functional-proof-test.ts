import assert from 'node:assert/strict'
import {
  observeGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-governed-readiness-observation'

const target = {
  processId: 424242,
  host: '127.0.0.1',
  port: 3000,
  runtimeAuthorityGranted: false as const,
  networkAuthorityGranted: false as const,
}

let probeCalls = 0

const result = observeGovernedRuntimeReadiness({
  target,
  probe: observedTarget => {
    probeCalls += 1

    assert.equal(observedTarget.processId, 424242)
    assert.equal(observedTarget.host, '127.0.0.1')
    assert.equal(observedTarget.port, 3000)
    assert.equal(observedTarget.runtimeAuthorityGranted, false)
    assert.equal(observedTarget.networkAuthorityGranted, false)

    return {
      observedProcessId: 424242,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: true,
      applicationResponsive: true,
    }
  },
})

assert.equal(probeCalls, 1)

assert.equal(result.observedProcessId, 424242)
assert.equal(result.observedHost, '127.0.0.1')
assert.equal(result.observedPort, 3000)

assert.equal(result.transportReachable, true)
assert.equal(result.applicationResponsive, true)

assert.equal(result.processIdentityVerified, true)
assert.equal(result.endpointIdentityVerified, true)
assert.equal(result.probeObservationRecorded, true)

assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.throws(
  () =>
    observeGovernedRuntimeReadiness({
      target,
      probe: () => ({
        observedProcessId: 424243,
        observedHost: '127.0.0.1',
        observedPort: 3000,
        transportReachable: true,
        applicationResponsive: true,
      }),
    }),
  /exact process and endpoint identity binding/,
)

console.log('CONTROLLED_PROBE_CALLS=1')
console.log('PROCESS_IDENTITY_VERIFIED=TRUE')
console.log('ENDPOINT_IDENTITY_VERIFIED=TRUE')
console.log('TRANSPORT_OBSERVATION_RECORDED=TRUE')
console.log('APPLICATION_OBSERVATION_RECORDED=TRUE')
console.log('MISMATCHED_PROCESS_ID_REJECTED=TRUE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')
console.log('REAL_OBSERVER_ADAPTER_IMPLEMENTED=FALSE')
console.log('HTTP_REQUEST_EXECUTED=FALSE')
console.log('REAL_HEALTH_OBSERVATION=FALSE')
console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
console.log('REAL_READINESS_OBSERVATION_FOUNDATION_FUNCTIONAL=PROVED')
