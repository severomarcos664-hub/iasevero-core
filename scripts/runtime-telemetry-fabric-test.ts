import {
  emitRuntimeTelemetry,
  readRuntimeTelemetry,
  clearRuntimeTelemetry,
} from '../app/lib/runtime-core/runtime-telemetry-fabric'

clearRuntimeTelemetry()

emitRuntimeTelemetry({
  source: 'runtime-telemetry-fabric-test',
  type: 'runtime-test-event',
  severity: 'info',
  correlationId: 'test-correlation',
  message: 'Telemetry fabric test event emitted.',
  payload: {
    ok: true,
    layer: 'v13.5.1',
  },
})

const events = readRuntimeTelemetry()

console.log('\n=== IASEVERO RUNTIME TELEMETRY FABRIC ===\n')
console.log(events)
