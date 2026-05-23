import {
  evaluateRuntimeExecutionOrchestrator
} from '../app/lib/runtime-core/runtime-execution-orchestrator'

const execution =
  evaluateRuntimeExecutionOrchestrator()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION ORCHESTRATOR ===\n'
)

console.log(execution)
