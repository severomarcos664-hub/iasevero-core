import {
  evaluateRuntimeExecutiveAuthority,
  type RuntimeCapabilityAuthorizationConstraint,
} from '../runtime-executive-authority/runtime-executive-authority'

export interface RuntimeExecutiveAuthorityGatewayReport {
  gatewayId: string
  createdAt: string
  source: 'runtime-executive-authority-gateway'

  executionAllowed: boolean

  capabilityAuthorizationIntegrated: boolean
  capabilityAuthorizationAllowsExecution: boolean
  coreState: string
  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveAuthorityGateway(
  capabilityAuthorization?: RuntimeCapabilityAuthorizationConstraint,
):
RuntimeExecutiveAuthorityGatewayReport {
  const authority =
    evaluateRuntimeExecutiveAuthority(capabilityAuthorization)

  return {
    gatewayId: `authority-gateway-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-executive-authority-gateway',

    executionAllowed:
      authority.executionAllowed,

    capabilityAuthorizationIntegrated:
      authority.capabilityAuthorizationIntegrated,

    capabilityAuthorizationAllowsExecution:
      authority.capabilityAuthorizationAllowsExecution,

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
