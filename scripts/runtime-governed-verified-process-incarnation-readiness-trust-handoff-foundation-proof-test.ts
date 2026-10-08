import {
  createVerifiedProcessIncarnationReadinessHandoff,
} from '../app/lib/runtime-execution-plane/runtime-verified-process-incarnation-readiness-handoff'

type Assert<T extends true> = T

type Input = Parameters<
  typeof createVerifiedProcessIncarnationReadinessHandoff
>[0]

type Result = ReturnType<
  typeof createVerifiedProcessIncarnationReadinessHandoff
>

type _RequiresVerification =
  Assert<Input extends {
    verification: {
      verificationEvaluated: true
      identityMatched: boolean
      processIncarnationEvidenceRecorded: true
      processIncarnationVerified: boolean
      readinessGranted: false
      livenessGranted: false
      runtimeAuthorityGranted: false
      networkAuthorityGranted: false
    }
  } ? true : false>

type _RequiresCandidate =
  Assert<Input extends {
    candidate: {
      processId: number
      processIdentityVerified: true
      readinessEvaluationEligible: true
      readinessGranted: false
      livenessGranted: false
      runtimeAuthorityGranted: false
      networkAuthorityGranted: false
    }
  } ? true : false>

type _OutputPreservesVerifiedIncarnation =
  Assert<Result extends {
    processIncarnationVerified: true
    readinessGranted: false
    livenessGranted: false
    runtimeAuthorityGranted: false
    networkAuthorityGranted: false
  } ? true : false>

void (0 as unknown as _RequiresVerification)
void (0 as unknown as _RequiresCandidate)
void (0 as unknown as _OutputPreservesVerifiedIncarnation)

console.log(
  'VERIFIED_PROCESS_INCARNATION_READINESS_TRUST_HANDOFF_FOUNDATION=PROVED',
)
console.log('PHYSICAL_EFFECT_EXECUTED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')
