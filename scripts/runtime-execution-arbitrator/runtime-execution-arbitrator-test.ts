import {
  evaluateRuntimeExecutionArbitrator,
} from '../../app/lib/runtime-execution-arbitrator/runtime-execution-arbitrator'

const report =
  evaluateRuntimeExecutionArbitrator()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION ARBITRATOR ===\n'
)

console.log(report)
