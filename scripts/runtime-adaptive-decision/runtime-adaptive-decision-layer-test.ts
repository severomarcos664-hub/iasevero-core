import {
  evaluateRuntimeAdaptiveDecisionLayer,
} from '../../app/lib/runtime-adaptive-decision/runtime-adaptive-decision-layer'

const report = evaluateRuntimeAdaptiveDecisionLayer()

console.log(
  '\n=== IASEVERO RUNTIME ADAPTIVE DECISION LAYER ===\n'
)

console.log(report)
