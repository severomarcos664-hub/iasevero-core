import {
  evaluateRuntimeExecutionGovernanceMatrix,
} from '../../app/lib/runtime-governance-matrix/runtime-execution-governance-matrix'

const report = evaluateRuntimeExecutionGovernanceMatrix()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION GOVERNANCE MATRIX ===\n'
)

console.log(report)
