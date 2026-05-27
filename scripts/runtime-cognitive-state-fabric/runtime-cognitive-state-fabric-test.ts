import {
  evaluateRuntimeCognitiveStateFabric,
} from '../../app/lib/runtime-cognitive-state-fabric/runtime-cognitive-state-fabric'

const report =
  evaluateRuntimeCognitiveStateFabric()

console.log(
  '\n=== IASEVERO RUNTIME COGNITIVE STATE FABRIC ===\n'
)

console.log(report)
