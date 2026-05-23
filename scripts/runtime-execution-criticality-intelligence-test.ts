import {
  evaluateRuntimeExecutionCriticality,
} from '../app/lib/runtime-core/runtime-execution-criticality-intelligence'

const report = evaluateRuntimeExecutionCriticality()

console.log('\n=== IASEVERO RUNTIME EXECUTION CRITICALITY INTELLIGENCE ===\n')
console.log(report)
