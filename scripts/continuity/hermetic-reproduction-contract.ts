export type HermeticReproductionContract = {
  sourceIdentityRequired: true
  tagIdentityRequired: true
  lockfileRequired: true
  cleanEnvironmentRequired: true
  toolchainIdentityRequired: true

  networkRuntimeAccess: false
  reproductionExecuted: false
  deploymentApplied: false
  promotionApplied: false
  runtimeAuthorityGranted: false

  boundary: 'SOURCE_CONTINUITY_NE_REPRODUCTION_EXECUTION'
}

export const HERMETIC_REPRODUCTION_CONTRACT: HermeticReproductionContract = {
  sourceIdentityRequired: true,
  tagIdentityRequired: true,
  lockfileRequired: true,
  cleanEnvironmentRequired: true,
  toolchainIdentityRequired: true,

  networkRuntimeAccess: false,
  reproductionExecuted: false,
  deploymentApplied: false,
  promotionApplied: false,
  runtimeAuthorityGranted: false,

  boundary: 'SOURCE_CONTINUITY_NE_REPRODUCTION_EXECUTION',
}

export function validateHermeticReproductionContract(
  contract: HermeticReproductionContract,
): boolean {
  return (
    contract.sourceIdentityRequired === true &&
    contract.tagIdentityRequired === true &&
    contract.lockfileRequired === true &&
    contract.cleanEnvironmentRequired === true &&
    contract.toolchainIdentityRequired === true &&
    contract.networkRuntimeAccess === false &&
    contract.reproductionExecuted === false &&
    contract.deploymentApplied === false &&
    contract.promotionApplied === false &&
    contract.runtimeAuthorityGranted === false &&
    contract.boundary === 'SOURCE_CONTINUITY_NE_REPRODUCTION_EXECUTION'
  )
}
