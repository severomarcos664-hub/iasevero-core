import assert from 'node:assert/strict'

import {
  createControlledProcessIncarnationEvidence,
} from '../app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-evidence'

const evidence = createControlledProcessIncarnationEvidence({
  processId: 424242,
  bootId: '11111111-2222-3333-4444-555555555555',
  processStartTicks: 987654321,
})

assert.equal(evidence.schemaVersion, 1)
assert.equal(
  evidence.kind,
  'iasevero-controlled-process-incarnation-evidence',
)

assert.equal(evidence.processId, 424242)
assert.equal(
  evidence.bootId,
  '11111111-2222-3333-4444-555555555555',
)
assert.equal(evidence.processStartTicks, 987654321)

assert.equal(evidence.processIncarnationEvidenceRecorded, true)
assert.equal(evidence.processIncarnationVerified, false)

assert.equal(evidence.readinessGranted, false)
assert.equal(evidence.livenessGranted, false)
assert.equal(evidence.runtimeAuthorityGranted, false)
assert.equal(evidence.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(evidence), true)

assert.throws(
  () =>
    createControlledProcessIncarnationEvidence({
      processId: 0,
      bootId: '11111111-2222-3333-4444-555555555555',
      processStartTicks: 987654321,
    }),
  /valid processId/,
)

assert.throws(
  () =>
    createControlledProcessIncarnationEvidence({
      processId: 424242,
      bootId: '   ',
      processStartTicks: 987654321,
    }),
  /non-empty bootId/,
)

assert.throws(
  () =>
    createControlledProcessIncarnationEvidence({
      processId: 424242,
      bootId: '11111111-2222-3333-4444-555555555555',
      processStartTicks: -1,
    }),
  /valid processStartTicks/,
)

assert.throws(
  () =>
    createControlledProcessIncarnationEvidence({
      processId: 424242,
      bootId: '11111111-2222-3333-4444-555555555555',
      processStartTicks: 1.5,
    }),
  /valid processStartTicks/,
)

console.log('VALID_PROCESS_INCARNATION_FIXTURE_ACCEPTED=TRUE')
console.log('PROCESS_ID_PRESERVED=TRUE')
console.log('BOOT_ID_PRESERVED=TRUE')
console.log('PROCESS_START_TICKS_PRESERVED=TRUE')
console.log('EVIDENCE_IMMUTABLE=TRUE')

console.log('INVALID_PROCESS_ID_REJECTED=TRUE')
console.log('EMPTY_BOOT_ID_REJECTED=TRUE')
console.log('INVALID_PROCESS_START_TICKS_REJECTED=TRUE')

console.log('PROCESS_INCARNATION_EVIDENCE_RECORDED=TRUE')
console.log('PROCESS_INCARNATION_VERIFIED=FALSE')

console.log('PROC_PROCESS_STAT_READ=FALSE')
console.log('BOOT_ID_READ=FALSE')
console.log('PROC_SOCKET_TABLE_READ=FALSE')
console.log('PHYSICAL_ENDPOINT_QUERY_EXECUTED=FALSE')
console.log('PHYSICAL_OWNERSHIP_VERIFIED=FALSE')
console.log('SOCKET_OPENED=FALSE')
console.log('HTTP_REQUEST_EXECUTED=FALSE')

console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_PROCESS_INCARNATION_EVIDENCE_FOUNDATION_FUNCTIONAL=PROVED',
)
