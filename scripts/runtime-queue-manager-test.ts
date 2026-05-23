import {
  enqueueRuntimeAction,
  dequeueRuntimeAction,
  readRuntimeQueue,
  clearRuntimeQueue,
} from '../app/lib/runtime-core/runtime-queue-manager'

clearRuntimeQueue()

enqueueRuntimeAction('observe', 'low')
enqueueRuntimeAction('stabilize', 'high')
enqueueRuntimeAction('containment', 'critical')

console.log('\n=== IASEVERO RUNTIME QUEUE MANAGER ===\n')

console.log('\nQUEUE:\n')
console.log(readRuntimeQueue())

console.log('\nDEQUEUE:\n')
console.log(dequeueRuntimeAction())

console.log('\nQUEUE AFTER:\n')
console.log(readRuntimeQueue())
