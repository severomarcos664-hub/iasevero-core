import {
  evaluateRuntimeCausalInfluence,
} from '../../app/lib/runtime-causal-influence-engine/runtime-causal-influence-engine'

const report =
  evaluateRuntimeCausalInfluence()

console.log(
  '\n=== IASEVERO RUNTIME CAUSAL INFLUENCE ENGINE ===\n'
)

console.log(report)
