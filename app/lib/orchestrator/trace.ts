type RuntimeTrace = {
  timestamp: string
  intent: string
  provider: string
  risk: string
  safe: boolean
  reason: string
}

const traces: RuntimeTrace[] = []

export function addTrace(trace: RuntimeTrace) {
  traces.push(trace)

  if (traces.length > 200) {
    traces.shift()
  }

  console.log(
    '[IASevero Trace]',
    JSON.stringify(trace)
  )
}

export function getRecentTraces() {
  return traces.slice(-20)
}
