import {
  evaluateRuntimeExecutionPipeline,
} from '@/app/lib/runtime-execution-pipeline/runtime-execution-pipeline'

export type RuntimeAttentionFocus =
  | 'execution'
  | 'stability'
  | 'throughput'
  | 'containment'

export interface RuntimeAttentionRegistryReport {
  attentionId: string
  createdAt: string
  source: 'runtime-attention-registry'
  focus: RuntimeAttentionFocus
  priority: 'low' | 'medium' | 'high' | 'critical'
  queueUtilization: number
  consensusRatio: number
  pipelineStable: boolean
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeAttentionRegistry():
RuntimeAttentionRegistryReport {
  const pipeline = evaluateRuntimeExecutionPipeline()

  const focus: RuntimeAttentionFocus =
    !pipeline.runtimeExecutionAllowed
      ? 'containment'
      : pipeline.queueUtilization >= 75
        ? 'throughput'
        : pipeline.pipelineStable
          ? 'execution'
          : 'stability'

  const priority =
    focus === 'containment'
      ? 'critical'
      : focus === 'throughput'
        ? 'high'
        : focus === 'stability'
          ? 'medium'
          : 'low'

  return {
    attentionId: `attention-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-attention-registry',

    focus,
    priority,

    queueUtilization: pipeline.queueUtilization,
    consensusRatio: pipeline.consensusRatio,
    pipelineStable: pipeline.pipelineStable,

    recommendation:
      `Runtime attention focused on ${focus}.`,

    reasoning: [
      `focus:${focus}`,
      `priority:${priority}`,
      `queue:${pipeline.queueUtilization}`,
      `consensus:${pipeline.consensusRatio}`,
      `stable:${pipeline.pipelineStable}`,
    ],
  }
}
