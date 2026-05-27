import {
  evaluateExecutiveRuntimeCore,
} from '../executive-runtime-core/executive-runtime-core'

export interface RuntimeExecutiveAuthorityReport {
  authorityId: string
  createdAt: string
  source: 'runtime-executive-authority'

  executionAllowed: boolean

  coreState: string
  executionPolicy: string
  runtimeAction: string

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveAuthority():
RuntimeExecutiveAuthorityReport {

  const core =
    evaluateExecutiveRuntimeCore()

  return {
    authorityId:
      `runtime-authority-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-executive-authority',

    executionAllowed:
      core.executionAllowed,

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
