import {
  evaluateRuntimeExecutiveAuthority,
} from '../runtime-executive-authority/runtime-executive-authority'

export interface RuntimeExecutiveAuthorityGatewayReport {
  gatewayId: string
  createdAt: string
  source: 'runtime-executive-authority-gateway'

  executionAllowed: boolean
  coreState: string
  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveAuthorityGateway():
RuntimeExecutiveAuthorityGatewayReport {
  const authority =
    evaluateRuntimeExecutiveAuthority()

  return {
    gatewayId: `authority-gateway-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-executive-authority-gateway',

    executionAllowed:
      authority.executionAllowed,

    coreState:
      authority.coreState,

    executionPolicy:
      authority.executionPolicy,

    runtimeAction:
      authority.runtimeAction,

    executionPriority:
      authority.executionPriority,

    executionRoute:
      authority.executionRoute,

    recommendation:
      authority.executionAllowed
        ? 'Runtime Executive Authority Gateway approved execution.'
        : 'Runtime Executive Authority Gateway blocked execution.',

    reasoning: [
      `allowed:${authority.executionAllowed}`,
      `core:${authority.coreState}`,
      `policy:${authority.executionPolicy}`,
      `action:${authority.runtimeAction}`,
      `priority:${authority.executionPriority}`,
      `route:${authority.executionRoute}`,
    ],
  }
}
