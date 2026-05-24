import {
  evaluateRuntimeExecutionProfileBridge
} from '../../app/lib/runtime-execution-bridge/runtime-execution-profile-bridge'

const report =
  evaluateRuntimeExecutionProfileBridge()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTION PROFILE BRIDGE ===\n'
)

console.log(report)
