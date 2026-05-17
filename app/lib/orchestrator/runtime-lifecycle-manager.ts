export type RuntimeLifecycleState =
  | 'booting'
  | 'operational'
  | 'degraded'
  | 'recovery'
  | 'maintenance'
  | 'shutdown'

export type RuntimeLifecycleTransition = {
  from: RuntimeLifecycleState
  to: RuntimeLifecycleState
  reason: string
  timestamp: string
}

export type RuntimeLifecycleSnapshot = {
  currentState: RuntimeLifecycleState
  previousState: RuntimeLifecycleState | null
  transitions: RuntimeLifecycleTransition[]
}

let runtimeLifecycle: RuntimeLifecycleSnapshot = {
  currentState: 'booting',
  previousState: null,
  transitions: []
}

export function getRuntimeLifecycle(): RuntimeLifecycleSnapshot {
  return runtimeLifecycle
}

export function transitionRuntimeLifecycle(
  next: RuntimeLifecycleState,
  reason: string
): RuntimeLifecycleSnapshot {
  const transition: RuntimeLifecycleTransition = {
    from: runtimeLifecycle.currentState,
    to: next,
    reason,
    timestamp: new Date().toISOString()
  }

  runtimeLifecycle = {
    currentState: next,
    previousState: runtimeLifecycle.currentState,
    transitions: [
      transition,
      ...runtimeLifecycle.transitions
    ].slice(0, 200)
  }

  return runtimeLifecycle
}

export function isRuntimeOperational(): boolean {
  return runtimeLifecycle.currentState === 'operational'
}

export function isRuntimeDegraded(): boolean {
  return runtimeLifecycle.currentState === 'degraded'
}

export function isRuntimeRecovering(): boolean {
  return runtimeLifecycle.currentState === 'recovery'
}
