import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { evaluateRuntimePredictiveStabilization } from '../app/lib/runtime-core/runtime-predictive-stabilization'
import { readRuntimeTelemetry } from '../app/lib/runtime-core/runtime-telemetry-fabric'

integrateRuntimeFeedback()

const predictive = evaluateRuntimePredictiveStabilization()
const telemetry = readRuntimeTelemetry()

console.log('\n=== IASEVERO RUNTIME PREDICTIVE TELEMETRY ===\n')

console.log('\nPREDICTIVE:\n')
console.log(predictive)

console.log('\nTELEMETRY:\n')
console.log(telemetry)
