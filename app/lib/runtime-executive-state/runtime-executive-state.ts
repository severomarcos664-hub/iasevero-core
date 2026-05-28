import {
  evaluateRuntimeExecutiveAuthorityGateway
} from '../runtime-executive-authority-gateway/runtime-executive-authority-gateway'

import {
  evaluateRuntimeProviderAuthority
} from '../runtime-provider-authority/runtime-provider-authority'

export type ExecutiveRuntimeState =
  | 'stable'
  | 'protected'
  | 'restricted'
  | 'expanding'

export interface RuntimeExecutiveStateReport {
  stateId: string
  createdAt: string
  source: 'runtime-executive-state'

  executiveState: ExecutiveRuntimeState

  executionAllowed: boolean
  provider: string
  allowExternal: boolean

  executionPolicy: string
  runtimeAction: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveState(
  message: string,
  intent = 'general'
): RuntimeExecutiveStateReport {

  const authority =
    evaluateRuntimeExecutiveAuthorityGateway()

  const provider =
    evaluateRuntimeProviderAuthority(
      message,
      intent
    )

  const executiveState: ExecutiveRuntimeState =
    !authority.executionAllowed
      ? 'restricted'
      : !provider.allowExternal
      ? 'protected'
      : authority.executionPolicy === 'adaptive-growth'
      ? 'expanding'
      : 'stable'

  return {
    stateId:
      `executive-state-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-executive-state',

    executiveState,

    executionAllowed:
      provider.executionAllowed,

    provider:
      provider.provider,

    allowExternal:
      provider.allowExternal,

    executionPolicy:
      provider.executionPolicy,

    runtimeAction:
      provider.runtimeAction,

    recommendation:
      `Executive Runtime State active: ${executiveState}.`,

    reasoning: [
      `state:${executiveState}`,
      `allowed:${provider.executionAllowed}`,
      `provider:${provider.provider}`,
      `external:${provider.allowExternal}`,
      `policy:${provider.executionPolicy}`,
      `action:${provider.runtimeAction}`
    ]
  }
}
