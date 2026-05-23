import {
  evaluateRuntimeExecutionCriticality,
} from './runtime-execution-criticality-intelligence'

export type RuntimeAutonomousAction =
  | 'continue'
  | 'monitor'
  | 'degrade'
  | 'isolate'
  | 'contain'
  | 'recover'

export type RuntimeAutonomousResponseReport = {
  responseId: string
  createdAt: string
  source: 'runtime-autonomous-response-intelligence'

  autonomousAction: RuntimeAutonomousAction

  runtimeStable: boolean
  requiresIntervention: boolean

  recommendation: string

  reasoning: string[]
}

export function evaluateRuntimeAutonomousResponse():
RuntimeAutonomousResponseReport {

  const criticality =
    evaluateRuntimeExecutionCriticality()

  const autonomousAction: RuntimeAutonomousAction =
    criticality.criticalityLevel === 'critical'
      ? 'contain'
      : criticality.criticalityLevel === 'high'
        ? 'recover'
        : criticality.criticalityLevel === 'medium'
          ? 'monitor'
          : 'continue'

  return {
    responseId: `response_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-autonomous-response-intelligence',

    autonomousAction,

    runtimeStable:
      autonomousAction === 'continue',

    requiresIntervention:
      autonomousAction !== 'continue',

    recommendation:
      autonomousAction === 'continue'
        ? 'Runtime stable: continue execution.'
        : autonomousAction === 'monitor'
          ? 'Runtime requires operational monitoring.'
          : autonomousAction === 'recover'
            ? 'Runtime recovery recommended.'
            : 'Runtime containment required.',

    reasoning: [
      ...criticality.reasoning,
      `autonomousAction:${autonomousAction}`,
    ],
  }
}
