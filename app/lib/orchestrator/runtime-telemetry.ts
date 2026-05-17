export type RuntimeTelemetrySnapshot = {
  timestamp: string
  latencyMs: number
  provider: string
  mode: string
  stable: boolean
  awarenessSeverity: string
  recoveryMode: boolean
  stabilizationLevel: string
  memoryMode: string
}

let telemetryHistory: RuntimeTelemetrySnapshot[] = []

export function registerRuntimeTelemetry(
  snapshot: RuntimeTelemetrySnapshot
): RuntimeTelemetrySnapshot {

  telemetryHistory = [
    snapshot,
    ...telemetryHistory
  ].slice(0, 200)

  return snapshot
}

export function getRuntimeTelemetry():
RuntimeTelemetrySnapshot[] {

  return telemetryHistory
}
