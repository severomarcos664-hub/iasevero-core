import { updateRuntimeRegistry } from '../orchestrator/runtime-state-registry'
import { runRuntimeDecisionLoop } from './runtime-decision-loop'

export type RuntimeTransitionState =
  | 'stable'
  | 'observing'
  | 'throttled'
  | 'contained'
  | 'recovery'

export type RuntimeStateTransitionResult = {
  generatedAt: string
  source: 'runtime-state-transition-engine'
  previousState: RuntimeTransitionState
  nextState: RuntimeTransitionState
  applied: boolean
  reason: string
  reasoning: string[]
}

let currentTransitionState: RuntimeTransitionState = 'stable'

export function transitionRuntimeState(): RuntimeStateTransitionResult {
  const loop = runRuntimeDecisionLoop()
  const previousState = currentTransitionState

  const nextState: RuntimeTransitionState =
    loop.nextStep === 'continue'
      ? 'stable'
      : loop.nextStep === 'observe'
        ? 'observing'
        : loop.nextStep === 'reduce-pressure'
          ? 'throttled'
          : loop.nextStep === 'contain'
            ? 'contained'
            : 'recovery'

  currentTransitionState = nextState

  updateRuntimeRegistry({
    recoveryMode: nextState === 'recovery',
    degradationState: nextState === 'contained' || nextState === 'recovery',
    runtimeHealth:
      nextState === 'stable'
        ? 'healthy'
        : nextState === 'observing'
          ? 'warning'
          : nextState === 'throttled'
            ? 'degraded'
            : 'critical',
    warnings: [
      `transition:${previousState}->${nextState}`,
      `cycle:${loop.cycleStatus}`,
    ],
  })

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-state-transition-engine',
    previousState,
    nextState,
    applied: true,
    reason: `Runtime transition applied: ${previousState} -> ${nextState}`,
    reasoning: [
      ...loop.reasoning,
      `transition:${previousState}->${nextState}`,
    ],
  }
}
