import {
  evaluateRuntimeExecutionScheduler,
} from '../../app/lib/runtime-execution-scheduler/runtime-execution-scheduler'

const report =
  evaluateRuntimeExecutionScheduler()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION SCHEDULER ===\n'
)

console.log(report)
