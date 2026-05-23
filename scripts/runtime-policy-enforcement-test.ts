import {
  enforceRuntimePolicy,
} from '../app/lib/runtime-core/runtime-policy-enforcement'

const report = enforceRuntimePolicy({
  userId: 'local-test',
  message: 'status operacional IASevero',
  operationalState: 'stable',
  governance: 'NORMAL_OPERATION',
})

console.log('\n=== IASEVERO POLICY ENFORCEMENT ===\n')
console.log(report)
