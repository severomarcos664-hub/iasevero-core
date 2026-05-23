import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { evaluateRuntimePolicy } from '../app/lib/runtime-core/runtime-policy-engine'

integrateRuntimeFeedback()

const policy = evaluateRuntimePolicy()

console.log('\n=== IASEVERO RUNTIME POLICY ENGINE ===\n')
console.log(policy)
