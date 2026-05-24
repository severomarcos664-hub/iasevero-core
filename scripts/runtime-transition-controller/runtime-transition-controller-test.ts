import {
  evaluateRuntimeTransitionController,
} from '../../app/lib/runtime-transition-controller/runtime-transition-controller'

const report =
  evaluateRuntimeTransitionController()

console.log(
  '\n=== IASEVERO RUNTIME TRANSITION CONTROLLER ===\n'
)

console.log(report)
