import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { scheduleRuntimeExecution } from '../app/lib/runtime-core/runtime-adaptive-scheduler'

integrateRuntimeFeedback()

const schedule = scheduleRuntimeExecution()

console.log('\n=== IASEVERO RUNTIME ADAPTIVE SCHEDULER ===\n')
console.log(schedule)
