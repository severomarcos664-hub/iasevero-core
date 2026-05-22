import {
  integrateRuntimeFeedback
} from '../app/lib/runtime-core/runtime-feedback-integration'

const feedback =
  integrateRuntimeFeedback()

console.log(
  '\n--- IASEVERO RUNTIME FEEDBACK INTEGRATION ---\n'
)

console.log(feedback)
