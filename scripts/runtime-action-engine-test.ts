import { executeRuntimeAction } from '../app/lib/runtime-core/runtime-action-engine'
import { readRuntimeEvents } from '../app/lib/runtime-core/runtime-event-bus'
import { readRuntimeTelemetry } from '../app/lib/runtime-core/runtime-telemetry-fabric'

const action = executeRuntimeAction(
  'stabilize',
  'runtime-warning subscriber requested preventive stabilization'
)

console.log('\n=== IASEVERO RUNTIME ACTION ENGINE ===\n')

console.log('\nACTION:\n')
console.log(action)

console.log('\nEVENTS:\n')
console.log(readRuntimeEvents())

console.log('\nTELEMETRY:\n')
console.log(readRuntimeTelemetry())
