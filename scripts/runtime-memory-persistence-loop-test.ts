import { runRuntimeMemoryPersistenceLoop } from '../app/lib/runtime-core/runtime-memory-persistence-loop'

const memory = runRuntimeMemoryPersistenceLoop()

console.log('\n=== IASEVERO RUNTIME MEMORY PERSISTENCE LOOP ===\n')
console.log(memory)
