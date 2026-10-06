import { spawn } from 'node:child_process'

import type {
  GovernedProcessSpawnRequest,
  GovernedProcessSpawner,
} from './runtime-process-materialization'

export type RuntimePhysicalSpawn = typeof spawn

export function createRuntimePhysicalProcessSpawner(
  physicalSpawn: RuntimePhysicalSpawn = spawn,
): GovernedProcessSpawner {
  return async (request: GovernedProcessSpawnRequest) => {
    const child = physicalSpawn(
      request.executable,
      [...request.arguments],
      {
        stdio: 'ignore',
      },
    )

    const pid = child.pid

    if (pid === undefined || !Number.isSafeInteger(pid) || pid <= 0) {
      throw new Error(
        'Governed physical process spawner requires a valid positive process id.',
      )
    }

    return { pid }
  }
}
