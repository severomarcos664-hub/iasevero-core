import type {
  GovernedProcessMaterializationInput,
  GovernedProcessMaterializationResult,
  GovernedProcessSpawner,
} from './runtime-process-materialization'
import {
  materializeGovernedProcess,
} from './runtime-process-materialization'
import {
  bindGovernedRuntimeProcessIdentity,
  type GovernedRuntimeProcessIdentityBinding,
} from './runtime-process-identity-binding'
import {
  prepareGovernedPersistentRuntimeLaunch,
  type GovernedPersistentRuntimeLaunchBoundary,
} from './runtime-persistent-launch-boundary'

export type GovernedFirstLaunchCompositionResult = {
  materialization: GovernedProcessMaterializationResult
  identityBinding: GovernedRuntimeProcessIdentityBinding
  persistentLaunch: GovernedPersistentRuntimeLaunchBoundary
}

export async function composeGovernedFirstLaunch(
  input: GovernedProcessMaterializationInput,
  spawnProcess: GovernedProcessSpawner,
): Promise<GovernedFirstLaunchCompositionResult> {
  const materialization = await materializeGovernedProcess(input, spawnProcess)
  const identityBinding =
    bindGovernedRuntimeProcessIdentity(materialization)
  const persistentLaunch =
    prepareGovernedPersistentRuntimeLaunch(identityBinding)

  return {
    materialization,
    identityBinding,
    persistentLaunch,
  }
}
