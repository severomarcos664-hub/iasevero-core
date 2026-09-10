import type {
  GovernedPersistentRuntimeLaunchBoundary,
} from './runtime-persistent-launch-boundary'

export type GovernedRuntimeReadinessEvidenceInput = {
  boundary: GovernedPersistentRuntimeLaunchBoundary

  observedProcessId: number
  observedHost: '127.0.0.1'
  observedPort: 3000

  transportReachable: boolean
  applicationResponsive: boolean
}

export type GovernedRuntimeReadinessEvidence = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-readiness-evidence'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  processIdentityVerified: true
  endpointSpecificationVerified: true
  probeEvidenceRecorded: true

  transportReachable: boolean
  applicationResponsive: boolean

  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function recordGovernedRuntimeReadinessEvidence(
  input: GovernedRuntimeReadinessEvidenceInput,
): GovernedRuntimeReadinessEvidence {
  const { boundary } = input

  if (
    boundary.processIdentityVerified !== true ||
    boundary.persistentLaunchEligible !== true ||
    boundary.persistentLaunchPrepared !== true ||
    boundary.processSpawnedByBoundary !== false ||
    !Number.isSafeInteger(boundary.processId) ||
    boundary.processId <= 0
  ) {
    throw new Error(
      'Governed runtime readiness evidence requires verified persistent launch boundary.',
    )
  }

  if (
    boundary.readinessGranted !== false ||
    boundary.livenessGranted !== false ||
    boundary.restartAuthorized !== false ||
    boundary.deploymentApplied !== false ||
    boundary.runtimeAuthorityGranted !== false ||
    boundary.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime readiness evidence requires zero inherited runtime authority.',
    )
  }

  if (
    input.observedProcessId !== boundary.processId ||
    input.observedHost !== '127.0.0.1' ||
    input.observedPort !== 3000
  ) {
    throw new Error(
      'Governed runtime readiness evidence requires identity-bound endpoint observation.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-readiness-evidence',

    instanceId: boundary.instanceId,
    releaseIdentity: boundary.releaseIdentity,
    authorizationRecordId: boundary.authorizationRecordId,
    processId: boundary.processId,

    processIdentityVerified: true,
    endpointSpecificationVerified: true,
    probeEvidenceRecorded: true,

    transportReachable: input.transportReachable,
    applicationResponsive: input.applicationResponsive,

    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
