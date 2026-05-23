import {
  evaluateRuntimeAdaptiveExecution,
} from './runtime-adaptive-execution-engine'

import {
  evaluateRuntimeResilience,
} from './runtime-resilience-engine'

import {
  orchestrateRuntimeTools,
} from './runtime-tool-orchestrator'

export type RuntimeEvaluationReport = {
  evaluationId: string
  createdAt: string
  source: 'runtime-evaluation-engine'
  executionScore: number
  stabilityScore: number
  toolScore: number
  riskScore: number
  overallScore: number
  quality:
    | 'excellent'
    | 'healthy'
    | 'degraded'
    | 'critical'
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutionQuality():
RuntimeEvaluationReport {

  const adaptive = evaluateRuntimeAdaptiveExecution()
  const resilience = evaluateRuntimeResilience()
  const tools = orchestrateRuntimeTools()

  const executionScore =
    adaptive.executionAllowed ? 100 : 30

  const stabilityScore =
    adaptive.workflowState === 'stable' &&
    resilience.strategy === 'continue'
      ? 100
      : resilience.strategy === 'retry'
        ? 70
        : resilience.strategy === 'fallback'
          ? 60
          : resilience.strategy === 'degrade'
            ? 45
            : 20

  const toolScore =
    tools.totalTools === 0
      ? 0
      : Math.round((tools.selectedTools / tools.totalTools) * 100)

  const riskScore =
    resilience.abortRequired
      ? 20
      : resilience.fallbackAllowed
        ? 60
        : resilience.retryAllowed
          ? 75
          : 100

  const overallScore =
    Math.round(
      (
        executionScore +
        stabilityScore +
        toolScore +
        riskScore
      ) / 4,
    )

  const quality =
    overallScore >= 90
      ? 'excellent'
      : overallScore >= 75
        ? 'healthy'
        : overallScore >= 50
          ? 'degraded'
          : 'critical'

  return {
    evaluationId: `eval_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-evaluation-engine',

    executionScore,
    stabilityScore,
    toolScore,
    riskScore,
    overallScore,
    quality,

    recommendation:
      quality === 'excellent'
        ? 'Runtime execution quality is excellent.'
        : quality === 'healthy'
          ? 'Runtime execution quality is healthy.'
          : quality === 'degraded'
            ? 'Runtime execution is degraded; review workflow and tools.'
            : 'Runtime execution is critical; containment required.',

    reasoning: [
      `execution:${executionScore}`,
      `stability:${stabilityScore}`,
      `tools:${toolScore}`,
      `risk:${riskScore}`,
      `overall:${overallScore}`,
      `quality:${quality}`,
    ],
  }
}
