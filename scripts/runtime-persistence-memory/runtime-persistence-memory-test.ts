import {
  evaluateRuntimePersistenceMemory,
} from '../../app/lib/runtime-persistence-memory/runtime-persistence-memory'

const report =
  evaluateRuntimePersistenceMemory()

console.log(
  '\n=== IASEVERO RUNTIME PERSISTENCE MEMORY ===\n'
)

console.log(report)
