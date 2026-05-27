import {
  evaluateRuntimeAdaptiveExecutionCoordinator,
} from '../../app/lib/runtime-adaptive-execution-coordinator/runtime-adaptive-execution-coordinator'

const report =
  evaluateRuntimeAdaptiveExecutionCoordinator()

console.log(
  '\n=== IASEVERO RUNTIME ADAPTIVE EXECUTION COORDINATOR ===\n'
)

console.log(report)
