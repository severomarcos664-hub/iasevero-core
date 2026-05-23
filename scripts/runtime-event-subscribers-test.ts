import {
  dispatchRuntimeEvent,
  registerRuntimeSubscriber,
  getRuntimeSubscribers,
} from '../app/lib/runtime-core/runtime-event-subscribers'

registerRuntimeSubscriber({
  id: 'runtime-supervisor',
  eventType: 'runtime-warning',
  onEvent(event) {
    console.log('\n[SUPERVISOR REACTION]\n')
    console.log(event)
  },
})

dispatchRuntimeEvent({
  source: 'runtime-test',
  type: 'runtime-warning',
  priority: 'high',
  payload: {
    degradationRisk: 'medium',
    stabilization: 'recommended',
  },
})

console.log('\n=== IASEVERO RUNTIME EVENT SUBSCRIBERS ===\n')

console.log(getRuntimeSubscribers())
