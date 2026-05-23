import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { coordinateRuntimeExecution } from '../app/lib/runtime-core/runtime-execution-coordinator'
import { readRuntimeEvents } from '../app/lib/runtime-core/runtime-event-bus'
import { readRuntimeTelemetry } from '../app/lib/runtime-core/runtime-telemetry-fabric'

integrateRuntimeFeedback()

const result = coordinateRuntimeExecution()

console.log('\n=== IASEVERO RUNTIME EXECUTION COORDINATOR ===\n')

console.log('\nCOORDINATOR:\n')
console.log(result)

console.log('\nEVENTS:\n')
console.log(readRuntimeEvents())

console.log('\nTELEMETRY:\n')
console.log(readRuntimeTelemetry())
