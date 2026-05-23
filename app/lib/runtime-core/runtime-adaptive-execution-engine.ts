import {
  coordinateRuntimeWorkflow,
} from './runtime-workflow-coordinator'

export type RuntimeAdaptiveExecutionReport = {
  adaptiveId: string
  createdAt: string
  source: 'runtime-adaptive-execution-engine'
  workflowState: string
  executionAllowed: boolean
  adaptationRequired: boolean
  strategy:
    | 'continue'
    | 'retry'
    | 'stabilize'
    | 'block'
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeAdaptiveExecution():
RuntimeAdaptiveExecutionReport {

  const workflow = coordinateRuntimeWorkflow()

  const adaptationRequired =
    !workflow.executionAllowed ||
    workflow.operationalState !== 'stable' ||
    workflow.pendingSteps > workflow.completedSteps + 3

  const strategy =
    !workflow.executionAllowed
      ? 'block'
      : workflow.operationalState !== 'stable'
        ? 'stabilize'
        : adaptationRequired
          ? 'retry'
          : 'continue'

  return {
    adaptiveId: `adaptive_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-adaptive-execution-engine',

    workflowState: workflow.operationalState,
    executionAllowed: workflow.executionAllowed,
    adaptationRequired,

    strategy,

    recommendation:
      strategy === 'continue'
        ? 'Adaptive execution approved: continue workflow.'
        : strategy === 'retry'
          ? 'Adaptive execution recommends retrying pending steps.'
          : strategy === 'stabilize'
            ? 'Adaptive execution recommends workflow stabilization.'
            : 'Adaptive execution blocked workflow.',

    reasoning: [
      `workflow:${workflow.operationalState}`,
      `allowed:${workflow.executionAllowed}`,
      `completed:${workflow.completedSteps}`,
      `pending:${workflow.pendingSteps}`,
      `strategy:${strategy}`,
    ],
  }
}
