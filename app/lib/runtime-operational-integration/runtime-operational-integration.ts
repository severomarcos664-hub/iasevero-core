import {
  evaluateRuntimeMetaController,
} from '@/app/lib/runtime-cognitive-core/runtime-meta-controller'

import {
  evaluateRuntimeExecutionPipeline,
} from '@/app/lib/runtime-execution-pipeline/runtime-execution-pipeline'

import {
  evaluateRuntimeExecutionRouter,
} from '@/app/lib/runtime-execution-router/runtime-execution-router'

export type RuntimeOperationalIntegrationState =
  | 'integrated'
  | 'monitored'
  | 'throttled'
  | 'restricted'

export interface RuntimeOperationalIntegrationReport {
  integrationId: string
  createdAt: string
  source: 'runtime-operational-integration'

  integrationState: RuntimeOperationalIntegrationState

  metaControllerMode: string
  attentionFocus: string
  attentionPriority: string

  pipelineState: string
  pipelineAction: string
  pipelineStable: boolean

  executionRoute: string
  executionAllowed: boolean

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeOperationalIntegration():
RuntimeOperationalIntegrationReport {
  const meta = evaluateRuntimeMetaController()
  const pipeline = evaluateRuntimeExecutionPipeline()
  const router = evaluateRuntimeExecutionRouter()

  const executionAllowed =
    meta.executionAllowed &&
    pipeline.runtimeExecutionAllowed &&
    router.executionAllowed

  const integrationState: RuntimeOperationalIntegrationState =
    !executionAllowed
      ? 'restricted'
      : meta.controllerMode === 'throttle' ||
        pipeline.pipelineAction === 'throttle-runtime'
        ? 'throttled'
        : meta.controllerMode === 'monitor'
          ? 'monitored'
          : 'integrated'

  return {
    integrationId: `integration-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-operational-integration',

    integrationState,

    metaControllerMode: meta.controllerMode,
    attentionFocus: meta.attentionFocus,
    attentionPriority: meta.attentionPriority,

    pipelineState: pipeline.pipelineState,
    pipelineAction: pipeline.pipelineAction,
    pipelineStable: pipeline.pipelineStable,

    executionRoute: router.executionRoute,
    executionAllowed,

    queueUtilization: pipeline.queueUtilization,
    consensusRatio: pipeline.consensusRatio,

    recommendation:
      executionAllowed
        ? 'Runtime operational integration approved.'
        : 'Runtime operational integration restricted.',

    reasoning: [
      `integration:${integrationState}`,
      `meta:${meta.controllerMode}`,
      `attention:${meta.attentionFocus}`,
      `priority:${meta.attentionPriority}`,
      `pipeline:${pipeline.pipelineAction}`,
      `route:${router.executionRoute}`,
      `allowed:${executionAllowed}`,
      `queue:${pipeline.queueUtilization}`,
      `consensus:${pipeline.consensusRatio}`,
    ],
  }
}
