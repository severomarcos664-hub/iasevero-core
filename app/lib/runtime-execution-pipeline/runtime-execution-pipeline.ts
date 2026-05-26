import {
  evaluateRuntimeAdaptiveDecisionLayer,
} from '@/app/lib/runtime-adaptive-decision/runtime-adaptive-decision-layer'

import {
  evaluateRuntimeConsensusEngine,
} from '@/app/lib/runtime-consensus-engine/runtime-consensus-engine'

import {
  evaluateRuntimeExecutionScheduler,
} from '@/app/lib/runtime-execution-scheduler/runtime-execution-scheduler'

import {
  evaluateRuntimeExecutionArbitrator,
} from '@/app/lib/runtime-execution-arbitrator/runtime-execution-arbitrator'

import {
  evaluateRuntimeQueueManager,
} from '@/app/lib/runtime-queue-manager/runtime-queue-manager'

export type RuntimePipelineState =
  | 'fully-operational'
  | 'controlled'
  | 'throttled'
  | 'contained'

export type RuntimePipelineAction =
  | 'dispatch-runtime'
  | 'controlled-runtime'
  | 'throttle-runtime'
  | 'contain-runtime'

export type RuntimeExecutionPipelineReport = {
  pipelineId: string
  createdAt: string
  source: 'runtime-execution-pipeline'

  pipelineState: RuntimePipelineState
  pipelineAction: RuntimePipelineAction

  consensusRatio: number
  queueUtilization: number

  executionPriority: string
  executionAction: string

  runtimeExecutionAllowed: boolean
  pipelineStable: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutionPipeline():
RuntimeExecutionPipelineReport {

  const decision =
    evaluateRuntimeAdaptiveDecisionLayer()

  const consensus =
    evaluateRuntimeConsensusEngine()

  const scheduler =
    evaluateRuntimeExecutionScheduler()

  const arbitrator =
    evaluateRuntimeExecutionArbitrator()

  const queue =
    evaluateRuntimeQueueManager()

  const pipelineState: RuntimePipelineState =
    !consensus.executionConsensus
      ? 'contained'
      : queue.queueState === 'critical'
        ? 'throttled'
        : scheduler.executionPriority === 'critical'
          ? 'fully-operational'
          : 'controlled'

  const pipelineAction: RuntimePipelineAction =
    pipelineState === 'fully-operational'
      ? 'dispatch-runtime'
      : pipelineState === 'controlled'
        ? 'controlled-runtime'
        : pipelineState === 'throttled'
          ? 'throttle-runtime'
          : 'contain-runtime'

  const pipelineStable =
    consensus.executionConsensus &&
    queue.queueStable &&
    arbitrator.arbitrationStable

  return {
    pipelineId:
      `pipeline-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-execution-pipeline',

    pipelineState,
    pipelineAction,

    consensusRatio:
      consensus.consensusRatio,

    queueUtilization:
      queue.queueUtilization,

    executionPriority:
      scheduler.executionPriority,

    executionAction:
      arbitrator.executionAction,

    runtimeExecutionAllowed:
      arbitrator.runtimeExecutionAllowed,

    pipelineStable,

    recommendation:
      pipelineAction === 'dispatch-runtime'
        ? 'Runtime execution pipeline fully operational.'
        : pipelineAction === 'controlled-runtime'
          ? 'Runtime execution pipeline under controlled flow.'
          : pipelineAction === 'throttle-runtime'
            ? 'Runtime execution pipeline throttling active.'
            : 'Runtime execution pipeline containment active.',

    reasoning: [
      `decision:${decision.adaptiveDecision}`,
      `consensus:${consensus.consensusRatio}`,
      `priority:${scheduler.executionPriority}`,
      `arbitration:${arbitrator.executionAction}`,
      `queue:${queue.queueState}`,
      `utilization:${queue.queueUtilization}`,
      `stable:${pipelineStable}`,
    ],
  }
}
