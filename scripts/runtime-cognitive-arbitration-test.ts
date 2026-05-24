import {
  evaluateRuntimeCognitiveArbitration,
} from '../app/lib/runtime-arbitration/runtime-cognitive-arbitration-engine'

const report =
  evaluateRuntimeCognitiveArbitration()

console.log(
  '\n=== IASEVERO RUNTIME COGNITIVE ARBITRATION ===\n'
)

console.log(report)
