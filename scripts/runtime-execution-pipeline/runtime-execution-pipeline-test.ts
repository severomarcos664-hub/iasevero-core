import {
  evaluateRuntimeExecutionPipeline,
} from '../../app/lib/runtime-execution-pipeline/runtime-execution-pipeline'

const report =
  evaluateRuntimeExecutionPipeline()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION PIPELINE ===\n'
)

console.log(report)
