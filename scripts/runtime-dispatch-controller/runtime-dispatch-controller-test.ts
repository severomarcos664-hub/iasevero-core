import {
  evaluateRuntimeDispatchController,
} from '../../app/lib/runtime-dispatch-controller/runtime-dispatch-controller'

const report =
  evaluateRuntimeDispatchController()

console.log(
  '\n=== IASEVERO RUNTIME DISPATCH CONTROLLER ===\n'
)

console.log(report)
