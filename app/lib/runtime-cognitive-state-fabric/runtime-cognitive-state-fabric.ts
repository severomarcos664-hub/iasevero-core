import {
  evaluateRuntimeCognitiveBus,
} from '@/app/lib/runtime-cognitive-bus/runtime-cognitive-bus'

export type RuntimeCognitiveFabricState =
  | 'coherent'
  | 'adaptive'
  | 'restricted'

export interface RuntimeCognitiveStateFabricReport {
  fabricId: string
  createdAt: string
  source: 'runtime-cognitive-state-fabric'

  fabricState: RuntimeCognitiveFabricState
  globalState: string

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
  cognitiveCoherence: number

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeCognitiveStateFabric():
RuntimeCognitiveStateFabricReport {
  const bus =
    evaluateRuntimeCognitiveBus()

  const cognitiveCoherence =
    bus.busState === 'synchronized' &&
    bus.executionAllowed &&
    bus.pipelineStable
      ? 98
      : bus.pipelineStable
        ? 82
        : 45

  const fabricState: RuntimeCognitiveFabricState =
    !bus.executionAllowed
      ? 'restricted'
      : cognitiveCoherence >= 95
        ? 'coherent'
        : 'adaptive'

  const globalState =
    `${fabricState}:${bus.attentionFocus}:${bus.reflectionState}:${bus.memoryState}`

  return {
    fabricId: `fabric-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-cognitive-state-fabric',

    fabricState,
    globalState,

    identityStatus: bus.identityStatus,
    attentionFocus: bus.attentionFocus,
    controllerMode: bus.controllerMode,
    integrationState: bus.integrationState,
    reflectionState: bus.reflectionState,
    memoryState: bus.memoryState,

    executionAllowed: bus.executionAllowed,
    pipelineStable: bus.pipelineStable,

    adaptationScore: bus.adaptationScore,
    synchronizationStrength: bus.synchronizationStrength,
    cognitiveCoherence,

    queueUtilization: bus.queueUtilization,
    consensusRatio: bus.consensusRatio,

    recommendation:
      bus.executionAllowed
        ? 'Runtime cognitive state fabric coherent.'
        : 'Runtime cognitive state fabric restricted.',

    reasoning: [
      `fabric:${fabricState}`,
      `global:${globalState}`,
      `identity:${bus.identityStatus}`,
      `focus:${bus.attentionFocus}`,
      `controller:${bus.controllerMode}`,
      `integration:${bus.integrationState}`,
      `reflection:${bus.reflectionState}`,
      `memory:${bus.memoryState}`,
      `coherence:${cognitiveCoherence}`,
      `sync:${bus.synchronizationStrength}`,
      `adaptation:${bus.adaptationScore}`,
      `queue:${bus.queueUtilization}`,
      `consensus:${bus.consensusRatio}`,
    ],
  }
}
