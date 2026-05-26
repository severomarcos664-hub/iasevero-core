import {
  evaluateRuntimeQueueManager,
} from '../../app/lib/runtime-queue-manager/runtime-queue-manager'

const report =
  evaluateRuntimeQueueManager()

console.log(
  '\n=== IASEVERO RUNTIME QUEUE MANAGER ===\n'
)

console.log(report)
