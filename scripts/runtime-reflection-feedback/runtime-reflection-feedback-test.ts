import {
  evaluateRuntimeReflectionFeedback,
} from '../../app/lib/runtime-reflection-feedback/runtime-reflection-feedback'

const report =
  evaluateRuntimeReflectionFeedback()

console.log(
  '\n=== IASEVERO RUNTIME REFLECTION FEEDBACK ===\n'
)

console.log(report)
