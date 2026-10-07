import assert from 'node:assert/strict'

import {
  createControlledProcessIncarnationEvidence,
} from '../app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-evidence'

import {
  verifyControlledProcessIncarnationEvidence,
} from '../app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-verification-decision'

const PROCESS_ID = 424242
const BOOT_ID =
  '11111111-2222-3333-4444-555555555555'
const START_TICKS = 987654321

const evidence =
  createControlledProcessIncarnationEvidence({
    processId: PROCESS_ID,
    bootId: BOOT_ID,
    processStartTicks: START_TICKS,
  })

const matched =
  verifyControlledProcessIncarnationEvidence({
    expected: {
      processId: PROCESS_ID,
      bootId: BOOT_ID,
      processStartTicks: START_TICKS,
    },
    evidence,
  })

assert.equal(
  matched.verificationEvaluated,
  true,
)

assert.equal(
  matched.identityMatched,
  true,
)

assert.equal(
  matched.processIncarnationVerified,
  true,
)

assert.equal(
  matched.readinessGranted,
  false,
)

assert.equal(
  matched.livenessGranted,
  false,
)

assert.equal(
  matched.runtimeAuthorityGranted,
  false,
)

assert.equal(
  matched.networkAuthorityGranted,
  false,
)

assert.equal(
  Object.isFrozen(matched),
  true,
)

const pidMismatch =
  verifyControlledProcessIncarnationEvidence({
    expected: {
      processId: PROCESS_ID + 1,
      bootId: BOOT_ID,
      processStartTicks: START_TICKS,
    },
    evidence,
  })

assert.equal(pidMismatch.identityMatched, false)
assert.equal(
  pidMismatch.processIncarnationVerified,
  false,
)

const bootMismatch =
  verifyControlledProcessIncarnationEvidence({
    expected: {
      processId: PROCESS_ID,
      bootId:
        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      processStartTicks: START_TICKS,
    },
    evidence,
  })

assert.equal(bootMismatch.identityMatched, false)
assert.equal(
  bootMismatch.processIncarnationVerified,
  false,
)

const startTicksMismatch =
  verifyControlledProcessIncarnationEvidence({
    expected: {
      processId: PROCESS_ID,
      bootId: BOOT_ID,
      processStartTicks: START_TICKS + 1,
    },
    evidence,
  })

assert.equal(
  startTicksMismatch.identityMatched,
  false,
)

assert.equal(
  startTicksMismatch.processIncarnationVerified,
  false,
)

assert.throws(
  () =>
    verifyControlledProcessIncarnationEvidence({
      expected: {
        processId: 0,
        bootId: BOOT_ID,
        processStartTicks: START_TICKS,
      },
      evidence,
    }),
  /requires a valid expected processId/,
)

assert.throws(
  () =>
    verifyControlledProcessIncarnationEvidence({
      expected: {
        processId: PROCESS_ID,
        bootId: '',
        processStartTicks: START_TICKS,
      },
      evidence,
    }),
  /requires a non-empty expected bootId/,
)

assert.throws(
  () =>
    verifyControlledProcessIncarnationEvidence({
      expected: {
        processId: PROCESS_ID,
        bootId: BOOT_ID,
        processStartTicks: 0,
      },
      evidence,
    }),
  /requires valid expected processStartTicks/,
)

console.log(
  'MATCHED_PROCESS_INCARNATION_VERIFIED=TRUE',
)

console.log(
  'PID_MISMATCH_REJECTED=TRUE',
)

console.log(
  'BOOT_ID_MISMATCH_REJECTED=TRUE',
)

console.log(
  'PROCESS_START_TICKS_MISMATCH_REJECTED=TRUE',
)

console.log(
  'INVALID_EXPECTED_IDENTITY_REJECTED=TRUE',
)

console.log(
  'RESULT_IMMUTABLE=TRUE',
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

console.log(
  'CONTROLLED_PROCESS_INCARNATION_VERIFICATION_DECISION_FUNCTIONAL=PROVED',
)
