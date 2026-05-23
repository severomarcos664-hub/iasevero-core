import {
  evaluateRuntimeAdaptiveExecution,
} from '../app/lib/runtime-core/runtime-adaptive-execution-engine'

const report = evaluateRuntimeAdaptiveExecution()

console.log('\n=== IASEVERO ADAPTIVE EXECUTION ENGINE ===\n')
console.log(report)
