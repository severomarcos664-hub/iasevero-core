import {
  evaluateRuntimeExecutionQuality,
} from '../app/lib/runtime-core/runtime-evaluation-engine'

const report = evaluateRuntimeExecutionQuality()

console.log('\n=== IASEVERO RUNTIME EVALUATION ENGINE ===\n')
console.log(report)
