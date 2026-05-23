import {
  evaluateRuntimeConfidence,
} from '../app/lib/runtime-core/runtime-confidence-intelligence'

const report = evaluateRuntimeConfidence()

console.log('\n=== IASEVERO RUNTIME CONFIDENCE INTELLIGENCE ===\n')
console.log(report)
