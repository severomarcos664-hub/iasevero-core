import assert from 'node:assert/strict'

import {
  prepareControlledLinuxProcessIncarnationSource,
} from '../app/lib/runtime-execution-plane/runtime-controlled-linux-process-incarnation-source'

const result =
  prepareControlledLinuxProcessIncarnationSource({
    processId: 424242,
  })

assert.equal(result.schemaVersion, 1)

assert.equal(
  result.kind,
  'iasevero-controlled-linux-process-incarnation-source',
)

assert.equal(result.processId, 424242)
assert.equal(result.sourceKind, 'linux-process-incarnation')

assert.equal(
  result.processIncarnationSourcePrepared,
  true,
)

assert.equal(result.bootIdRead, false)
assert.equal(result.processStatRead, false)
assert.equal(result.processIncarnationVerified, false)

assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

assert.throws(
  () =>
    prepareControlledLinuxProcessIncarnationSource({
      processId: 0,
    }),
  /valid processId/,
)

assert.throws(
  () =>
    prepareControlledLinuxProcessIncarnationSource({
      processId: -1,
    }),
  /valid processId/,
)

assert.throws(
  () =>
    prepareControlledLinuxProcessIncarnationSource({
      processId: 1.5,
    }),
  /valid processId/,
)

assert.throws(
  () =>
    prepareControlledLinuxProcessIncarnationSource({
      processId: Number.MAX_SAFE_INTEGER + 1,
    }),
  /valid processId/,
)

console.log('VALID_PROCESS_ID_ACCEPTED=TRUE')
console.log('ZERO_PROCESS_ID_REJECTED=TRUE')
console.log('NEGATIVE_PROCESS_ID_REJECTED=TRUE')
console.log('FRACTIONAL_PROCESS_ID_REJECTED=TRUE')
console.log('UNSAFE_PROCESS_ID_REJECTED=TRUE')

console.log('PROCESS_INCARNATION_SOURCE_PREPARED=TRUE')

console.log('BOOT_ID_READ=FALSE')
console.log('PROC_PROCESS_STAT_READ=FALSE')
console.log('PROCESS_INCARNATION_VERIFIED=FALSE')

console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log('SOURCE_RESULT_IMMUTABLE=TRUE')

console.log(
  'CONTROLLED_LINUX_PROCESS_INCARNATION_SOURCE_FOUNDATION_FUNCTIONAL=PROVED',
)
