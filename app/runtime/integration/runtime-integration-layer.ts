import {
  runtimeFlowController
} from '../flow/runtime-flow-controller'

import {
  enqueueRuntimeAction,
  getRuntimeQueueSize
} from '../queue/runtime-action-queue'

import {
  sortRuntimeActionsByPriority,
  type RuntimePriority
} from '../priority/runtime-priority-engine'

import {
  arbitrateRuntimeAction
} from '../arbitration/runtime-arbitration-layer'

export function submitRuntimeIntegratedAction(input: {
  id: string
  type: string
  priority: RuntimePriority
  payload?: unknown
}) {
  const decision = arbitrateRuntimeAction({
    id: input.id,
    type: input.type,
    priority: input.priority
  })

  if (decision !== 'allow') {
    return { accepted: false, decision }
  }

  runtimeFlowController.register({
    id: input.id,
    type: input.type,
    priority:
      input.priority === 'CRITICAL' ? 0 :
      input.priority === 'HIGH' ? 1 :
      input.priority === 'NORMAL' ? 2 : 3,
    createdAt: Date.now()
  })

  enqueueRuntimeAction({
    id: input.id,
    type: input.type,
    payload: input.payload,
    createdAt: Date.now()
  })

  return {
    accepted: true,
    decision,
    queueSize: getRuntimeQueueSize()
  }
}

export function orderRuntimePriorities(actions: {
  id: string
  type: string
  priority: RuntimePriority
}[]) {
  return sortRuntimeActionsByPriority(actions)
}
