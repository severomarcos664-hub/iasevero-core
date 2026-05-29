import {
  buildExecutiveRuntimeContext,
} from '../executive-runtime-context/executive-runtime-context'

export type RuntimeGovernanceDecision =
  | 'allow'
  | 'restrict'
  | 'protect'
  | 'stabilize'

export type RuntimeGovernancePriority =
  | 'critical'
  | 'high'
  | 'balanced'
  | 'restricted'

export interface RuntimeExecutiveGovernanceReport {
  governanceId: string
  createdAt: string
  source: 'runtime-executive-governance-layer'

  decision: RuntimeGovernanceDecision
  priority: RuntimeGovernancePriority

  executionAllowed: boolean
  executiveState: string
  provider: string
  allowExternal: boolean

  executionPolicy: string
  runtimeAction: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveGovernanceLayer(
  message: string,
  userId = 'local',
  intent = 'general'
): RuntimeExecutiveGovernanceReport {
  const context =
    buildExecutiveRuntimeContext(message, userId, intent)

  const decision: RuntimeGovernanceDecision =
    !context.executionAllowed
      ? 'restrict'
      : context.executiveState === 'protected'
      ? 'protect'
      : context.executionPolicy === 'adaptive-growth'
      ? 'allow'
      : 'stabilize'

  const priority: RuntimeGovernancePriority =
    decision === 'restrict'
      ? 'restricted'
      : decision === 'protect'
      ? 'critical'
      : context.executionPriority === 'high'
      ? 'high'
      : 'balanced'

  return {
    governanceId: `regl-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-executive-governance-layer',

    decision,
    priority,

    executionAllowed: context.executionAllowed,
    executiveState: context.executiveState,
    provider: context.provider,
    allowExternal: context.allowExternal,

    executionPolicy: context.executionPolicy,
    runtimeAction: context.runtimeAction,
    executionRoute: context.executionRoute,

    recommendation:
      `REGL decision: ${decision} / priority: ${priority}.`,

    reasoning: [
      `decision:${decision}`,
      `priority:${priority}`,
      `allowed:${context.executionAllowed}`,
      `state:${context.executiveState}`,
      `provider:${context.provider}`,
      `external:${context.allowExternal}`,
      `policy:${context.executionPolicy}`,
      `action:${context.runtimeAction}`,
      `route:${context.executionRoute}`,
      `intent:${intent}`,
      `user:${userId}`,
    ],
  }
}
