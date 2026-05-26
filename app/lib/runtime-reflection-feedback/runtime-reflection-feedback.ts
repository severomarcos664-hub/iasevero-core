import {
  evaluateRuntimeOperationalIntegration,
} from '@/app/lib/runtime-operational-integration/runtime-operational-integration'

export type RuntimeReflectionState =
  | 'learning'
  | 'observing'
  | 'stabilizing'
  | 'restricted'

export interface RuntimeReflectionFeedbackReport {
  reflectionId: string
  createdAt: string
  source: 'runtime-reflection-feedback'

  reflectionState: RuntimeReflectionState

  integrationState: string

  executionAllowed: boolean
  pipelineStable: boolean

  attentionFocus: string
  executionRoute: string

  operationalPressure: number
  adaptationScore: number

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeReflectionFeedback():
RuntimeReflectionFeedbackReport {
  const integration =
    evaluateRuntimeOperationalIntegration()

  const operationalPressure =
    integration.queueUtilization >= 85
      ? 90
      : integration.queueUtilization >= 70
        ? 70
        : 40

  const adaptationScore =
    integration.consensusRatio >= 95 &&
    integration.pipelineStable
      ? 95
      : integration.pipelineStable
        ? 75
        : 40

  const reflectionState: RuntimeReflectionState =
    !integration.executionAllowed
      ? 'restricted'
      : operationalPressure >= 85
        ? 'stabilizing'
        : adaptationScore >= 90
          ? 'learning'
          : 'observing'

  return {
    reflectionId: `reflection-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-reflection-feedback',

    reflectionState,

    integrationState: integration.integrationState,

    executionAllowed:
      integration.executionAllowed,

    pipelineStable:
      integration.pipelineStable,

    attentionFocus:
      integration.attentionFocus,

    executionRoute:
      integration.executionRoute,

    operationalPressure,
    adaptationScore,

    queueUtilization:
      integration.queueUtilization,

    consensusRatio:
      integration.consensusRatio,

    recommendation:
      integration.executionAllowed
        ? 'Runtime reflection feedback active.'
        : 'Runtime reflection feedback restricted.',

    reasoning: [
      `reflection:${reflectionState}`,
      `integration:${integration.integrationState}`,
      `allowed:${integration.executionAllowed}`,
      `stable:${integration.pipelineStable}`,
      `focus:${integration.attentionFocus}`,
      `route:${integration.executionRoute}`,
      `pressure:${operationalPressure}`,
      `adaptation:${adaptationScore}`,
      `queue:${integration.queueUtilization}`,
      `consensus:${integration.consensusRatio}`,
    ],
  }
}
