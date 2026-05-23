import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { evaluateRuntimeSeverityGovernance } from '../app/lib/runtime-core/runtime-severity-governance'

integrateRuntimeFeedback()

const governance = evaluateRuntimeSeverityGovernance()

console.log('\n=== IASEVERO RUNTIME SEVERITY GOVERNANCE ===\n')
console.log(governance)
