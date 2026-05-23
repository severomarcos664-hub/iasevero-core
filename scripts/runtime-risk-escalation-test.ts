import {
  evaluateRuntimeRiskEscalation,
} from '../app/lib/runtime-core/runtime-risk-escalation-intelligence'

const report =
  evaluateRuntimeRiskEscalation()

console.log(
  '\n=== IASEVERO RUNTIME RISK ESCALATION ===\n'
)

console.log(report)
