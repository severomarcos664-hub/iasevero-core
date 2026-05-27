import {
  evaluateRuntimeExecutionRouter,
} from '../../app/lib/runtime-execution-router/runtime-execution-router'

const report =
  evaluateRuntimeExecutionRouter()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION ROUTER ===\n'
)

console.log(report)
