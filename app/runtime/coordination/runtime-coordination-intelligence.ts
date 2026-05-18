export interface RuntimeCoordinationSnapshot {
  queueSize: number
  activeTasks: number
  conflictsDetected: number
}

export type RuntimeCoordinationStatus =
  | 'stable'
  | 'busy'
  | 'congested'
  | 'conflicted'

export function analyzeRuntimeCoordination(
  snapshot: RuntimeCoordinationSnapshot
): RuntimeCoordinationStatus {
  if (snapshot.conflictsDetected > 0) {
    return 'conflicted'
  }

  if (snapshot.queueSize >= 20 || snapshot.activeTasks >= 10) {
    return 'congested'
  }

  if (snapshot.queueSize >= 5 || snapshot.activeTasks >= 3) {
    return 'busy'
  }

  return 'stable'
}
