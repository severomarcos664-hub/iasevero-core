type RuntimeLimits = {
  maxEvents: number
  maxTraces: number
  maxQueue: number
}

const limits: RuntimeLimits = {
  maxEvents: 500,
  maxTraces: 500,
  maxQueue: 100
}

export function getRuntimeLimits() {
  return limits
}

export function isLimitExceeded(data: {
  events: number
  traces: number
  queue: number
}) {
  return {
    events: data.events > limits.maxEvents,
    traces: data.traces > limits.maxTraces,
    queue: data.queue > limits.maxQueue
  }
}
