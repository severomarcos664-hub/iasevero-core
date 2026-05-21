import { enforceRuntimeGovernance }
from '../app/lib/runtime-core/runtime-governance-enforcement'

const enforcement =
  enforceRuntimeGovernance()

console.log('\n=== IASEVERO GOVERNANCE ENFORCEMENT ===\n')

console.log(enforcement)
