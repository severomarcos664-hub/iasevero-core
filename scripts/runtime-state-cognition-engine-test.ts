import {
  evaluateRuntimeStateCognition,
} from '../app/lib/runtime-core/runtime-state-cognition-engine'

const report =
  evaluateRuntimeStateCognition()

console.log('\n=== IASEVERO RUNTIME STATE COGNITION ENGINE ===\n')

console.log(report)
