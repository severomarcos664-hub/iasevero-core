import { evaluateRuntimeExecutionOrchestrator } from './runtime-execution-orchestrator'

export type RuntimeDecisionLoopResult = {
  generatedAt: string
  source: 'runtime-decision-loop'
  cycleStatus: 'normal' | 'throttled' | 'contained' | 'recovery'
  executionAction: string
  providerMode: string
  nextStep:
    | 'continue'
    | 'observe'
    | 'reduce-pressure'
    | 'contain'
    | 'recover'
  telemetryRequired: boolean
  snapshotRequired: boolean
  reasoning: string[]
}

export function runRuntimeDecisionLoop(): RuntimeDecisionLoopResult {
  const execution = evaluateRuntimeExecutionOrchestrator()

  const cycleStatus =
    execution.action === 'normal-operation'
      ? 'normal'
      : execution.action === 'throttle-runtime'
        ? 'throttled'
        : execution.action === 'containment-mode'
          ? 'contained'
          : 'recovery'

  const nextStep =
    execution.action === 'normal-operation'
      ? 'continue'
      : execution.action === 'throttle-runtime'
        ? 'observe'
        : execution.action === 'containment-mode'
          ? 'contain'
          : 'recover'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-decision-loop',
    cycleStatus,
    executionAction: execution.action,
    providerMode: execution.providerMode,
    nextStep,
    telemetryRequired: execution.telemetryRequired,
    snapshotRequired: execution.snapshotRequired,
    reasoning: [
      ...execution.reasoning,
      `cycle:${cycleStatus}`,
      `next:${nextStep}`,
    ],
  }
}
