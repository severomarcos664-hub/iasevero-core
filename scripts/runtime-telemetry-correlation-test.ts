import { integrateRuntimeFeedback } from '../app/lib/runtime-core/runtime-feedback-integration'
import { correlateRuntimeTelemetry } from '../app/lib/runtime-core/runtime-telemetry-correlation'

integrateRuntimeFeedback()

const correlation = correlateRuntimeTelemetry()

console.log('\n=== IASEVERO RUNTIME TELEMETRY CORRELATION ===\n')
console.log(correlation)
