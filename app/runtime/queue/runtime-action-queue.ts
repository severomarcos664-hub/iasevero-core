export interface RuntimeAction {
  id: string
  type: string
  payload?: unknown
  createdAt: number
}

const runtimeQueue: RuntimeAction[] = []

export function enqueueRuntimeAction(action: RuntimeAction) {
  runtimeQueue.push(action)
}

export function dequeueRuntimeAction() {
  return runtimeQueue.shift()
}

export function getRuntimeQueueSize() {
  return runtimeQueue.length
}

export function getRuntimeQueueSnapshot() {
  return [...runtimeQueue]
}
