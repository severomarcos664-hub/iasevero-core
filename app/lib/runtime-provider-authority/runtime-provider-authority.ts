import {
  evaluateRuntimeExecutiveAuthorityGateway
} from '../runtime-executive-authority-gateway/runtime-executive-authority-gateway'

import {
  resolveProviderRoute
} from '../orchestrator/routing'

export interface RuntimeProviderAuthorityReport {
  authorityId: string
  createdAt: string
  source: 'runtime-provider-authority'

  provider: string
  allowExternal: boolean
  executionAllowed: boolean

  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeProviderAuthority(
  message: string,
  intent = 'general'
): RuntimeProviderAuthorityReport {

  const authority =
    evaluateRuntimeExecutiveAuthorityGateway()

  const route =
    resolveProviderRoute(message, intent)

  const executionAllowed =
    authority.executionAllowed &&
    (
      !route.allowExternal ||
      authority.executionPolicy !== 'protection-first'
    )

  return {
    authorityId:
      `provider-authority-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-provider-authority',

    provider:
      route.provider,

    allowExternal:
      route.allowExternal,

    executionAllowed,

    executionPolicy:
      authority.executionPolicy,

    runtimeAction:
      authority.runtimeAction,

    executionPriority:
      authority.executionPriority,

    executionRoute:
      authority.executionRoute,

    recommendation:
      executionAllowed
        ? 'Provider execution approved.'
        : 'Provider execution blocked.',

    reasoning: [
      `provider:${route.provider}`,
      `external:${route.allowExternal}`,
      `allowed:${executionAllowed}`,
      `policy:${authority.executionPolicy}`,
      `action:${authority.runtimeAction}`,
      `priority:${authority.executionPriority}`,
      `route:${authority.executionRoute}`,
      `route:${route.reason}`
    ]
  }
}
