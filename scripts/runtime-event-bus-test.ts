import {
  publishRuntimeEvent,
  readRuntimeEvents,
  clearRuntimeEvents,
} from '../app/lib/runtime-core/runtime-event-bus'

clearRuntimeEvents()

publishRuntimeEvent({
  source: 'runtime-event-bus-test',
  type: 'runtime-bus-test-event',
  priority: 'normal',
  payload: {
    ok: true,
    layer: 'v13.5.8',
  },
})

console.log('\n=== IASEVERO RUNTIME EVENT BUS ===\n')
console.log(readRuntimeEvents())
