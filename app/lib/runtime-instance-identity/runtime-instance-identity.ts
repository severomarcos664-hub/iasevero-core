import type {
  GovernedReleaseRuntimeIdentity,
} from '../runtime-release-identity/runtime-release-identity'

export type GovernedRuntimeInstanceIdentityInput = {
  releaseIdentity: GovernedReleaseRuntimeIdentity
  instanceId: string
  startedAt: string
}

export type GovernedRuntimeInstanceIdentity = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-instance-identity'

  instanceId: string
  startedAt: string

  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  artifactSha256: string
  attestationSha256: string
  contentAddress: string
  signerKeyId: string

  releaseBindingVerified: true
  instanceIdentityCreated: true

  promotionApplied: false
  deploymentApplied: false
  executionApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`Governed runtime instance identity requires ${field}.`)
  }

  return normalized
}

function requireIsoTimestamp(value: string): string {
  const normalized = requireNonEmpty(value, 'startedAt')
  const parsed = Date.parse(normalized)

  if (!Number.isFinite(parsed)) {
    throw new Error(
      'Governed runtime instance identity requires valid startedAt.',
    )
  }

  return normalized
}

export function createGovernedRuntimeInstanceIdentity(
  input: GovernedRuntimeInstanceIdentityInput,
): GovernedRuntimeInstanceIdentity {
  const release = input.releaseIdentity

  if (
    release.evidenceVerified !== true ||
    release.bindingVerified !== true
  ) {
    throw new Error(
      'Governed runtime instance identity requires verified release binding.',
    )
  }

  if (
    release.promotionApplied !== false ||
    release.deploymentApplied !== false ||
    release.runtimeAuthorityGranted !== false ||
    release.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime instance identity requires zero inherited authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-instance-identity',

    instanceId: requireNonEmpty(input.instanceId, 'instanceId'),
    startedAt: requireIsoTimestamp(input.startedAt),

    releaseIdentity: release.releaseIdentity,
    sourceCommit: release.sourceCommit,
    sourceTag: release.sourceTag,
    artifactSha256: release.artifactSha256,
    attestationSha256: release.attestationSha256,
    contentAddress: release.contentAddress,
    signerKeyId: release.signerKeyId,

    releaseBindingVerified: true,
    instanceIdentityCreated: true,

    promotionApplied: false,
    deploymentApplied: false,
    executionApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
