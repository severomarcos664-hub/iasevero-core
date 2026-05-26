import {
  evaluateRuntimeMemoryConsolidation,
} from '../../app/lib/runtime-memory-consolidation/runtime-memory-consolidation'

const report =
  evaluateRuntimeMemoryConsolidation()

console.log(
  '\n=== IASEVERO RUNTIME MEMORY CONSOLIDATION ===\n'
)

console.log(report)
