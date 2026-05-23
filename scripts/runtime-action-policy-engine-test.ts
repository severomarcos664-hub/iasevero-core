import {
  evaluateRuntimeActionPolicy,
} from '../app/lib/runtime-core/runtime-action-policy-engine'

const report = evaluateRuntimeActionPolicy()

console.log('\n=== IASEVERO RUNTIME ACTION POLICY ENGINE ===\n')
console.log(report)
