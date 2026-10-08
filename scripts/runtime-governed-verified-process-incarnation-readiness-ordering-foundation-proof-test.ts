import {
  assessGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-readiness-assessment'

type CandidateEvidence = Parameters<typeof assessGovernedRuntimeReadiness>[0]

const candidate = {
  kind: 'iasevero-governed-runtime-readiness-evidence',
  schemaVersion: 1,
  instanceId: 'instance-v287.73-proof',
  releaseIdentity: 'v287.73.3-proof-release',
  authorizationRecordId: 'authorization-v287.73-proof',
  processId: 4242,
  processIdentityVerified: true,
  endpointSpecificationVerified: true,
  probeEvidenceRecorded: true,
  transportReachable: true,
  applicationResponsive: true,
  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
} satisfies CandidateEvidence

const assessment = assessGovernedRuntimeReadiness(candidate)

if (assessment.readinessCriteriaSatisfied !== true) {
  throw new Error(
    'Verified process incarnation must participate in readiness criteria without directly granting readiness.',
  )
}

if (
  assessment.readinessGranted !== false ||
  assessment.livenessGranted !== false ||
  assessment.runtimeAuthorityGranted !== false ||
  assessment.networkAuthorityGranted !== false
) {
  throw new Error(
    'Verified process incarnation readiness ordering must not grant collateral authority.',
  )
}

console.log('VERIFIED_PROCESS_INCARNATION_READINESS_ORDERING_FUNCTIONAL=PASS')
console.log('PROCESS_INCARNATION_VERIFIED_REQUIRED=TRUE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')
