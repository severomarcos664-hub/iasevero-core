import type { GovernedFirstLaunchCompositionResult } from './runtime-first-launch-composition'
import {
  createInitialRuntimeReadinessCandidate,
  type GovernedRuntimeReadinessCandidate,
} from './runtime-readiness-candidate'

export function prepareFirstLaunchPostSpawnReadiness(
  launch: GovernedFirstLaunchCompositionResult,
): GovernedRuntimeReadinessCandidate {
  if (
    launch.materialization.processStarted !== true ||
    launch.materialization.processIdAssigned !== true ||
    !Number.isSafeInteger(launch.materialization.processId) ||
    launch.materialization.processId <= 0 ||
    launch.materialization.runtimeAuthorityGranted !== false ||
    launch.materialization.networkAuthorityGranted !== false
  ) {
    throw new Error('Post-spawn readiness requires governed first-launch materialization.')
  }

  return createInitialRuntimeReadinessCandidate(launch.persistentLaunch)
}
