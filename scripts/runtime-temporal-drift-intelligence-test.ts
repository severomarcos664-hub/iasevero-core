import {
  evaluateRuntimeTemporalDrift,
} from '../app/lib/runtime-core/runtime-temporal-drift-intelligence'

const report = evaluateRuntimeTemporalDrift()

console.log('\n=== IASEVERO RUNTIME TEMPORAL DRIFT INTELLIGENCE ===\n')
console.log(report)
