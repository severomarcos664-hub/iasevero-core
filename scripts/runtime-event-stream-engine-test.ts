import {
  clearRuntimeEventStream,
  publishRuntimeStreamEvent,
  readRuntimeEventStream,
} from '../app/lib/runtime-core/runtime-event-stream-engine'

clearRuntimeEventStream()

const correlationId = `test-${Date.now()}`

publishRuntimeStreamEvent('request.received', correlationId, {
  userId: 'local-test',
})

publishRuntimeStreamEvent('runtime.checked', correlationId, {
  operationalState: 'stable',
})

publishRuntimeStreamEvent('governance.evaluated', correlationId, {
  decision: 'NORMAL_OPERATION',
})

publishRuntimeStreamEvent('execution.allowed', correlationId, {
  allowed: true,
})

publishRuntimeStreamEvent('response.generated', correlationId, {
  ok: true,
})

console.log('\n=== IASEVERO RUNTIME EVENT STREAM ENGINE ===\n')
console.log(readRuntimeEventStream())
