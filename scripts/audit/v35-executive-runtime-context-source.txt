import {
  evaluateRuntimeExecutiveAuthorityGateway,
} from '../runtime-executive-authority-gateway/runtime-executive-authority-gateway'

import {
  evaluateRuntimeExecutiveState,
} from '../runtime-executive-state/runtime-executive-state'

import {
  evaluateRuntimeProviderAuthority,
} from '../runtime-provider-authority/runtime-provider-authority'

export interface ExecutiveRuntimeContextReport {
  contextId: string
  createdAt: string
  source: 'executive-runtime-context'

  intent: string
  userId: string

  executionAllowed: boolean
  executiveState: string
  provider: string
  allowExternal: boolean

  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function buildExecutiveRuntimeContext(
  message: string,
  userId = 'local',
  intent = 'general'
): ExecutiveRuntimeContextReport {
  const authority =
    evaluateRuntimeExecutiveAuthorityGateway()

  const state =
    evaluateRuntimeExecutiveState(message, intent)

  const provider =
    evaluateRuntimeProviderAuthority(message, intent)

  const executionAllowed =
    authority.executionAllowed &&
    state.executionAllowed &&
    provider.executionAllowed

  return {
    contextId: `executive-context-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'executive-runtime-context',

    intent,
    userId,

    executionAllowed,
    executiveState: state.executiveState,
    provider: provider.provider,
    allowExternal: provider.allowExternal,

    executionPolicy: authority.executionPolicy,
    runtimeAction: authority.runtimeAction,
    executionPriority: authority.executionPriority,
    executionRoute: authority.executionRoute,

    recommendation: executionAllowed
      ? 'Executive Runtime Context approved execution.'
      : 'Executive Runtime Context restricted execution.',

    reasoning: [
      `allowed:${executionAllowed}`,
      `authority:${authority.executionAllowed}`,
      `state:${state.executiveState}`,
      `stateAllowed:${state.executionAllowed}`,
      `provider:${provider.provider}`,
      `providerAllowed:${provider.executionAllowed}`,
      `external:${provider.allowExternal}`,
      `policy:${authority.executionPolicy}`,
      `action:${authority.runtimeAction}`,
      `priority:${authority.executionPriority}`,
      `route:${authority.executionRoute}`,
      `intent:${intent}`,
      `user:${userId}`,
    ],
  }
}
