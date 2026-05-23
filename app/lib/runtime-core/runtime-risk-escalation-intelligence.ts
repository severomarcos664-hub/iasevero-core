import {
  evaluateRuntimeStrategicIntelligence,
} from './runtime-strategic-intelligence'

export type RuntimeEscalationLevel =
  | 'normal'
  | 'monitoring'
  | 'elevated'
  | 'critical'
  | 'containment'

export type RuntimeEscalationAction =
  | 'continue'
  | 'observe'
  | 'degrade'
  | 'recover'
  | 'contain'
  | 'block'

export type RuntimeRiskEscalationReport = {
  escalationId: string
  createdAt: string
  source: 'runtime-risk-escalation-intelligence'

  escalationLevel: RuntimeEscalationLevel
  escalationAction: RuntimeEscalationAction

  strategicPosture: string
  confidenceScore: number

  operationalRisk: string
  escalationRequired: boolean
  containmentRequired: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeRiskEscalation():
RuntimeRiskEscalationReport {

  const strategic =
    evaluateRuntimeStrategicIntelligence()

  const escalationLevel: RuntimeEscalationLevel =
    strategic.operationalRisk === 'low'
      ? 'normal'
      : strategic.operationalRisk === 'medium'
        ? 'monitoring'
        : strategic.operationalRisk === 'high'
          ? 'elevated'
          : strategic.posture === 'containment'
            ? 'containment'
            : 'critical'

  const escalationAction: RuntimeEscalationAction =
    escalationLevel === 'normal'
      ? 'continue'
      : escalationLevel === 'monitoring'
        ? 'observe'
        : escalationLevel === 'elevated'
          ? 'degrade'
          : escalationLevel === 'critical'
            ? 'recover'
            : 'contain'

  const escalationRequired =
    escalationLevel !== 'normal'

  const containmentRequired =
    escalationLevel === 'containment'

  return {
    escalationId: `escalation_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-risk-escalation-intelligence',

    escalationLevel,
    escalationAction,

    strategicPosture: strategic.posture,
    confidenceScore: strategic.confidenceScore,

    operationalRisk: strategic.operationalRisk,
    escalationRequired,
    containmentRequired,

    recommendation:
      containmentRequired
        ? 'Runtime containment required immediately.'
        : escalationRequired
          ? 'Runtime escalation monitoring activated.'
          : 'Runtime operating within safe strategic limits.',

    reasoning: [
      ...strategic.reasoning,
      `escalation:${escalationLevel}`,
      `action:${escalationAction}`,
      `containment:${containmentRequired}`,
    ],
  }
}
