import {
  evaluateRuntimeCoreIdentity,
} from './runtime-core-identity'

import {
  evaluateRuntimeAttentionRegistry,
} from './runtime-attention-registry'

export type RuntimeMetaControllerMode =
  | 'operate'
  | 'monitor'
  | 'throttle'
  | 'contain'

export interface RuntimeMetaControllerReport {
  controllerId: string
  createdAt: string
  source: 'runtime-meta-controller'
  controllerMode: RuntimeMetaControllerMode
  executionAllowed: boolean
  identityStatus: string
  attentionFocus: string
  attentionPriority: string
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeMetaController():
RuntimeMetaControllerReport {
  const identity = evaluateRuntimeCoreIdentity()
  const attention = evaluateRuntimeAttentionRegistry()

  const controllerMode: RuntimeMetaControllerMode =
    !identity.executionAllowed
      ? 'contain'
      : attention.priority === 'critical'
        ? 'contain'
        : attention.priority === 'high'
          ? 'throttle'
          : attention.priority === 'medium'
            ? 'monitor'
            : 'operate'

  const executionAllowed =
    identity.executionAllowed &&
    controllerMode !== 'contain'

  return {
    controllerId: `meta-controller-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-meta-controller',

    controllerMode,
    executionAllowed,

    identityStatus: identity.status,
    attentionFocus: attention.focus,
    attentionPriority: attention.priority,

    recommendation:
      executionAllowed
        ? 'Runtime meta-controller approved execution.'
        : 'Runtime meta-controller restricted execution.',

    reasoning: [
      ...identity.reasoning,
      ...attention.reasoning,
      `controller:${controllerMode}`,
      `execution:${executionAllowed}`,
    ],
  }
}
