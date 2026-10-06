import assert from 'node:assert/strict'
import { createRuntimePhysicalProcessSpawner } from '../app/lib/runtime-execution-plane/runtime-physical-process-spawner'
import type { GovernedProcessSpawnRequest } from '../app/lib/runtime-execution-plane/runtime-process-materialization'

async function main() {
  let calls = 0

  const physicalSpawn = ((executable: string, args: readonly string[], options: { stdio: 'ignore' }) => {
      calls += 1

      assert.equal(executable, 'node')
      assert.deepEqual(args, [
        'start',
        '-H',
        '127.0.0.1',
        '-p',
        '3000',
      ])
      assert.equal(options.stdio, 'ignore')

      return { pid: 424242 }
    }) as unknown as Parameters<typeof createRuntimePhysicalProcessSpawner>[0]

  const spawner = createRuntimePhysicalProcessSpawner(physicalSpawn)

  const request: GovernedProcessSpawnRequest = {
    executable: 'node',
    entrypoint: 'node_modules/next/dist/bin/next',
  arguments: [
      'start',
      '-H',
      '127.0.0.1',
      '-p',
      '3000',
    ],
  }

  const result = await spawner(request)

  assert.equal(calls, 1)
  assert.equal(result.pid, 424242)

  console.log('SPAWN_CALLS=1')
  console.log('PROCESS_ID=424242')
  console.log('REAL_OS_PROCESS_STARTED=FALSE')
  console.log('PHYSICAL_SPAWNER_ADAPTER=PROVED')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
