import {
  evaluateExecutiveRuntimeCore,
} from '../executive-runtime-core/executive-runtime-core'

export interface RuntimeExecutiveAuthorityReport {
  authorityId: string
  createdAt: string
  source: 'runtime-executive-authority'

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

export interface RuntimeCapabilityAuthorizationConstraint {
  authorizationAssessed: boolean
  decision: 'eligible' | 'ineligible' | 'unknown'
  executionAuthorized: false
}

export function evaluateRuntimeExecutiveAuthority(
  capabilityAuthorization?: RuntimeCapabilityAuthorizationConstraint,
):
RuntimeExecutiveAuthorityReport {

  const core =
    evaluateExecutiveRuntimeCore()

  const capabilityAuthorizationIntegrated =
    capabilityAuthorization !== undefined

  const capabilityAuthorizationAllowsExecution =
    !capabilityAuthorizationIntegrated ||
    (
      capabilityAuthorization.authorizationAssessed &&
      capabilityAuthorization.decision === 'eligible'
    )

  const executionAllowed =
    core.executionAllowed &&
    capabilityAuthorizationAllowsExecution

  return {
    authorityId:
      `runtime-authority-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-executive-authority',

    executionAllowed,

    capabilityAuthorizationIntegrated,
    capabilityAuthorizationAllowsExecution,

    coreState:
      core.coreState,

    executionPolicy:
      core.executionPolicy,

    runtimeAction:
      core.runtimeAction,

    executionPriority:
      core.executionPriority,

    executionRoute:
      core.executionRoute,

    recommendation:
      `Runtime Executive Authority active: ${core.coreState}.`,

    reasoning: [
      `allowed:${core.executionAllowed}`,
      `core:${core.coreState}`,
      `policy:${core.executionPolicy}`,
      `action:${core.runtimeAction}`,
      `priority:${core.executionPriority}`,
      `route:${core.executionRoute}`,
    ],
  }
}
