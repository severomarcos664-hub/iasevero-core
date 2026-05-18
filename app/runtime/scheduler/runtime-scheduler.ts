import {
  dequeueRuntimeAction,
  getRuntimeQueueSize
} from '../queue/runtime-action-queue'

let schedulerRunning = false

export async function processRuntimeQueue() {
  if (schedulerRunning) {
    return
  }

  schedulerRunning = true

  try {
    while (getRuntimeQueueSize() > 0) {
      const action = dequeueRuntimeAction()

      if (!action) {
        break
      }

      console.log(
        '[runtime-scheduler]',
        action.type,
        action.id
      )
    }
  } finally {
    schedulerRunning = false
  }
}

export function isRuntimeSchedulerRunning() {
  return schedulerRunning
}
