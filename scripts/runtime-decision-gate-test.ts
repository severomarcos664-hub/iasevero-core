import {
  evaluateRuntimeDecisionGate,
} from '../app/lib/runtime-core/runtime-decision-gate'

const report = evaluateRuntimeDecisionGate(
  'status operacional IASevero',
  'local-test',
)

console.log('\n=== IASEVERO RUNTIME DECISION GATE ===\n')
console.log(report)
