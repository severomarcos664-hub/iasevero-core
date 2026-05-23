import {
  evaluateRuntimeResilience,
} from '../app/lib/runtime-core/runtime-resilience-engine'

const report = evaluateRuntimeResilience()

console.log('\n=== IASEVERO RUNTIME RESILIENCE ENGINE ===\n')
console.log(report)
