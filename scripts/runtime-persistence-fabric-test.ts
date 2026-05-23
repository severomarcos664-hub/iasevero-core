import {
  persistRuntimeRecord,
  readRuntimePersistence,
  buildRuntimePersistenceRecord,
} from '../app/lib/runtime-core/runtime-persistence-fabric'

const governance =
  buildRuntimePersistenceRecord(
    'runtime-governance-center',
    'governance',
    {
      decision: 'NORMAL_OPERATION',
      risk: 'low',
    }
  )

const timeline =
  buildRuntimePersistenceRecord(
    'runtime-timeline-engine',
    'timeline',
    {
      events: 3,
      severity: 'normal',
    }
  )

const recovery =
  buildRuntimePersistenceRecord(
    'runtime-recovery-engine',
    'recovery',
    {
      recoveryReady: true,
      restoration: 'safe',
    }
  )

const governancePath =
  persistRuntimeRecord(governance)

const timelinePath =
  persistRuntimeRecord(timeline)

const recoveryPath =
  persistRuntimeRecord(recovery)

console.log(
  '\n=== IASEVERO RUNTIME PERSISTENCE FABRIC ===\n'
)

console.log({
  governancePath,
  timelinePath,
  recoveryPath,
})

console.log('\n=== GOVERNANCE FILES ===\n')
console.log(
  readRuntimePersistence('governance')
)

console.log('\n=== TIMELINE FILES ===\n')
console.log(
  readRuntimePersistence('timeline')
)

console.log('\n=== RECOVERY FILES ===\n')
console.log(
  readRuntimePersistence('recovery')
)
