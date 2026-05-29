import {
  buildExecutiveRuntimeContext
} from '../executive-runtime-context/executive-runtime-context'

import {
  evaluateRuntimeExecutiveGovernanceLayer
} from '../runtime-executive-governance-layer/runtime-executive-governance-layer'

export interface RuntimeEnforcementAuthorityReport {
  enforcementId: string
  createdAt: string
  source: 'runtime-enforcement-authority'

  finalExecutionAllowed: boolean

  governanceDecision: string
  governancePriority: string

  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  provider: string
  executiveState: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeEnforcementAuthority(
  message: string,
  userId = 'local',
  intent = 'general'
): RuntimeEnforcementAuthorityReport {

  const context =
    buildExecutiveRuntimeContext(
      message,
      userId,
      intent
    )

  const governance =
    evaluateRuntimeExecutiveGovernanceLayer(
      message,
      userId,
      intent
    )

  const finalExecutionAllowed =
    context.executionAllowed &&
    governance.executionAllowed

  return {
    enforcementId: `enforcement-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-enforcement-authority',

    finalExecutionAllowed,

    governanceDecision: governance.decision,
    governancePriority: governance.priority,

    executionPolicy: governance.executionPolicy,
    runtimeAction: governance.runtimeAction,
    executionPriority: governance.priority,
    executionRoute: governance.executionRoute,

    provider: governance.provider,
    executiveState: governance.executiveState,

    recommendation:
      finalExecutionAllowed
        ? 'Runtime Enforcement Authority approved execution.'
        : 'Runtime Enforcement Authority blocked execution.',

    reasoning: [
      `allowed:${finalExecutionAllowed}`,
      `decision:${governance.decision}`,
      `priority:${governance.priority}`,
      `provider:${governance.provider}`,
      `state:${governance.executiveState}`,
      `policy:${governance.executionPolicy}`,
      `action:${governance.runtimeAction}`,
      `route:${governance.executionRoute}`,
      `intent:${intent}`,
      `user:${userId}`
    ]
  }
}
