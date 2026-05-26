import {
  evaluateRuntimeCoreIdentity,
} from '@/app/lib/runtime-cognitive-core/runtime-core-identity'

import {
  evaluateRuntimeAttentionRegistry,
} from '@/app/lib/runtime-cognitive-core/runtime-attention-registry'

import {
  evaluateRuntimeMetaController,
} from '@/app/lib/runtime-cognitive-core/runtime-meta-controller'

import {
  evaluateRuntimeOperationalIntegration,
} from '@/app/lib/runtime-operational-integration/runtime-operational-integration'

import {
  evaluateRuntimeReflectionFeedback,
} from '@/app/lib/runtime-reflection-feedback/runtime-reflection-feedback'

import {
  evaluateRuntimeMemoryConsolidation,
} from '@/app/lib/runtime-memory-consolidation/runtime-memory-consolidation'

export type RuntimeCognitiveBusState =
  | 'synchronized'
  | 'adaptive'
  | 'restricted'

export interface RuntimeCognitiveBusReport {
  busId: string
  createdAt: string
  source: 'runtime-cognitive-bus'

  busState: RuntimeCognitiveBusState

  identityStatus: string
  attentionFocus: string
  controllerMode: string
  integrationState: string
  reflectionState: string
  memoryState: string

  executionAllowed: boolean
  pipelineStable: boolean

  adaptationScore: number
  synchronizationStrength: number

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeCognitiveBus():
RuntimeCognitiveBusReport {

  const identity =
    evaluateRuntimeCoreIdentity()

  const attention =
    evaluateRuntimeAttentionRegistry()

  const controller =
    evaluateRuntimeMetaController()

  const integration =
    evaluateRuntimeOperationalIntegration()

  const reflection =
    evaluateRuntimeReflectionFeedback()

  const memory =
    evaluateRuntimeMemoryConsolidation()

  const synchronizationStrength =
    integration.pipelineStable &&
    reflection.pipelineStable &&
    memory.memoryState === 'consolidating'
      ? 98
      : integration.pipelineStable
        ? 80
        : 45

  const busState: RuntimeCognitiveBusState =
    !controller.executionAllowed
      ? 'restricted'
      : synchronizationStrength >= 95
        ? 'synchronized'
        : 'adaptive'

  return {
    busId: `bus-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-cognitive-bus',

    busState,

    identityStatus:
      controller.identityStatus,

    attentionFocus:
      attention.focus,

    controllerMode:
      controller.controllerMode,

    integrationState:
      integration.integrationState,

    reflectionState:
      reflection.reflectionState,

    memoryState:
      memory.memoryState,

    executionAllowed:
      controller.executionAllowed,

    pipelineStable:
      integration.pipelineStable,

    adaptationScore:
      reflection.adaptationScore,

    synchronizationStrength,

    queueUtilization:
      integration.queueUtilization,

    consensusRatio:
      integration.consensusRatio,

    recommendation:
      controller.executionAllowed
        ? 'Runtime cognitive bus synchronized.'
        : 'Runtime cognitive bus restricted.',

    reasoning: [
      `bus:${busState}`,
      `identity:${controller.identityStatus}`,
      `focus:${attention.focus}`,
      `controller:${controller.controllerMode}`,
      `integration:${integration.integrationState}`,
      `reflection:${reflection.reflectionState}`,
      `memory:${memory.memoryState}`,
      `sync:${synchronizationStrength}`,
      `adaptation:${reflection.adaptationScore}`,
      `queue:${integration.queueUtilization}`,
      `consensus:${integration.consensusRatio}`,
    ],
  }
}
