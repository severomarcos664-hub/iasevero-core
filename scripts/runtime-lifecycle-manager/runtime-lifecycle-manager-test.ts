import {
  evaluateRuntimeLifecycleManager,
} from '../../app/lib/runtime-lifecycle-manager/runtime-lifecycle-manager'

const report = evaluateRuntimeLifecycleManager()

console.log(
  '\n=== IASEVERO RUNTIME LIFECYCLE MANAGER ===\n'
)

console.log(report)
