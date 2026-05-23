import {
  evaluateRuntimeAutonomousResponse,
} from './runtime-autonomous-response-intelligence'

export type RuntimeActionPolicyReport = {
  policyId: string
  createdAt: string
  source: 'runtime-action-policy-engine'
  action: string
  allowExecution: boolean
  allowTools: boolean
  allowExternalCalls: boolean
  requireMonitoring: boolean
  requireRecovery: boolean
  requireContainment: boolean
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeActionPolicy():
RuntimeActionPolicyReport {
  const response = evaluateRuntimeAutonomousResponse()

  const requireContainment =
    response.autonomousAction === 'contain'

  const requireRecovery =
    response.autonomousAction === 'recover'

  const requireMonitoring =
    response.autonomousAction === 'monitor'

  return {
    policyId: `action_policy_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-action-policy-engine',

    action: response.autonomousAction,

    allowExecution:
      !requireContainment,

    allowTools:
      response.autonomousAction === 'continue' ||
      response.autonomousAction === 'monitor',

    allowExternalCalls:
      response.autonomousAction === 'continue',

    requireMonitoring,
    requireRecovery,
    requireContainment,

    recommendation:
      requireContainment
        ? 'Action policy: containment enforced.'
        : requireRecovery
          ? 'Action policy: recovery mode required.'
          : requireMonitoring
            ? 'Action policy: monitoring required.'
            : 'Action policy: execution approved.',

    reasoning: [
      ...response.reasoning,
      `allowExecution:${!requireContainment}`,
      `allowTools:${response.autonomousAction === 'continue' || response.autonomousAction === 'monitor'}`,
      `allowExternalCalls:${response.autonomousAction === 'continue'}`,
    ],
  }
}
