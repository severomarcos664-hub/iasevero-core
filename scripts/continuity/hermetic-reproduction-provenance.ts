import { createHash } from 'node:crypto'

export type HermeticReproductionProvenanceInput = {
  sourceCommit: string
  sourceTag: string
  packageLockSha256: string
  observedNodeVersion: string
  observedNpmVersion: string

  sourceIdentityVerified: boolean
  tagIdentityVerified: boolean
  lockfileVerified: boolean
  cleanEnvironmentVerified: boolean
  installSucceeded: boolean
  tscSucceeded: boolean
  proofSucceeded: boolean
  regressionSucceeded: boolean
  buildSucceeded: boolean
  reproductionSucceeded: boolean
}

export type HermeticReproductionProvenance = {
  schemaVersion: 1
  kind: 'iasevero-hermetic-reproduction-provenance'

  sourceCommit: string
  sourceTag: string
  packageLockSha256: string

  observedToolchain: {
    node: string
    npm: string
  }

  validation: {
    sourceIdentityVerified: boolean
    tagIdentityVerified: boolean
    lockfileVerified: boolean
    cleanEnvironmentVerified: boolean
    installSucceeded: boolean
    tscSucceeded: boolean
    proofSucceeded: boolean
    regressionSucceeded: boolean
    buildSucceeded: boolean
    reproductionSucceeded: boolean
  }

  provenanceSha256: string
  provenanceVerified: true

  attestationCreated: false
  artifactCreated: false
  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export function serializeHermeticReproductionProvenance(
  input: HermeticReproductionProvenanceInput,
): string {
  return [
    'schemaVersion=1',
    'kind=iasevero-hermetic-reproduction-provenance',
    `sourceCommit=${input.sourceCommit}`,
    `sourceTag=${input.sourceTag}`,
    `packageLockSha256=${input.packageLockSha256}`,
    `observedNodeVersion=${input.observedNodeVersion}`,
    `observedNpmVersion=${input.observedNpmVersion}`,
    `sourceIdentityVerified=${input.sourceIdentityVerified}`,
    `tagIdentityVerified=${input.tagIdentityVerified}`,
    `lockfileVerified=${input.lockfileVerified}`,
    `cleanEnvironmentVerified=${input.cleanEnvironmentVerified}`,
    `installSucceeded=${input.installSucceeded}`,
    `tscSucceeded=${input.tscSucceeded}`,
    `proofSucceeded=${input.proofSucceeded}`,
    `regressionSucceeded=${input.regressionSucceeded}`,
    `buildSucceeded=${input.buildSucceeded}`,
    `reproductionSucceeded=${input.reproductionSucceeded}`,
  ].join('\n')
}

export function calculateHermeticReproductionProvenanceSha256(
  input: HermeticReproductionProvenanceInput,
): string {
  return createHash('sha256')
    .update(serializeHermeticReproductionProvenance(input), 'utf8')
    .digest('hex')
}

export function createHermeticReproductionProvenance(
  input: HermeticReproductionProvenanceInput,
): HermeticReproductionProvenance {
  const provenanceSha256 =
    calculateHermeticReproductionProvenanceSha256(input)

  return {
    schemaVersion: 1,
    kind: 'iasevero-hermetic-reproduction-provenance',

    sourceCommit: input.sourceCommit,
    sourceTag: input.sourceTag,
    packageLockSha256: input.packageLockSha256,

    observedToolchain: {
      node: input.observedNodeVersion,
      npm: input.observedNpmVersion,
    },

    validation: {
      sourceIdentityVerified: input.sourceIdentityVerified,
      tagIdentityVerified: input.tagIdentityVerified,
      lockfileVerified: input.lockfileVerified,
      cleanEnvironmentVerified: input.cleanEnvironmentVerified,
      installSucceeded: input.installSucceeded,
      tscSucceeded: input.tscSucceeded,
      proofSucceeded: input.proofSucceeded,
      regressionSucceeded: input.regressionSucceeded,
      buildSucceeded: input.buildSucceeded,
      reproductionSucceeded: input.reproductionSucceeded,
    },

    provenanceSha256,
    provenanceVerified: true,

    attestationCreated: false,
    artifactCreated: false,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
