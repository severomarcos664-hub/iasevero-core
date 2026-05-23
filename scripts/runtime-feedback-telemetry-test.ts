import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { readRuntimeTelemetry } from '../app/lib/runtime-core/runtime-telemetry-fabric'

const feedback = integrateRuntimeFeedback()

const telemetry = readRuntimeTelemetry()

console.log('\n=== IASEVERO FEEDBACK TELEMETRY ===\n')

console.log('\nFEEDBACK:\n')
console.log(feedback)

console.log('\nTELEMETRY:\n')
console.log(telemetry)
