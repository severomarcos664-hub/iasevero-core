import {
  evaluateRuntimeConsensusEngine,
} from '../../app/lib/runtime-consensus-engine/runtime-consensus-engine'

const report =
  evaluateRuntimeConsensusEngine()

console.log(
  '\n=== IASEVERO RUNTIME CONSENSUS ENGINE ===\n'
)

console.log(report)
