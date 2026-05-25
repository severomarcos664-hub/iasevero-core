import {
  evaluateRuntimeConsensusEngine,
} from '@/app/lib/runtime-consensus-engine/runtime-consensus-engine'

export type RuntimeExecutionPriority =
  | 'low'
  | 'balanced'
  | 'high'
  | 'critical'

export type RuntimeExecutionSchedulerReport = {
  schedulerId: string
  createdAt: string
  source: 'runtime-execution-scheduler'

  executionPriority: RuntimeExecutionPriority

  executionWindowMs: number
  executionThroughput: number

  pacingMode:
    | 'conservative'
    | 'balanced'
    | 'aggressive'

  runtimeExecutionAllowed: boolean

  schedulerStable: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutionScheduler():
RuntimeExecutionSchedulerReport {

  const consensus =
    evaluateRuntimeConsensusEngine()

  const executionPriority =
    consensus.consensusRatio >= 95
      ? 'critical'
      : consensus.consensusRatio >= 85
        ? 'high'
        : consensus.consensusRatio >= 70
          ? 'balanced'
          : 'low'

  const executionWindowMs =
    executionPriority === 'critical'
      ? 50
      : executionPriority === 'high'
        ? 120
        : executionPriority === 'balanced'
          ? 250
          : 500

  const executionThroughput =
    executionPriority === 'critical'
      ? 100
      : executionPriority === 'high'
        ? 80
        : executionPriority === 'balanced'
          ? 55
          : 25

  const pacingMode =
    executionPriority === 'critical'
      ? 'aggressive'
      : executionPriority === 'high'
        ? 'balanced'
        : 'conservative'

  return {
    schedulerId:
      `scheduler-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-execution-scheduler',

    executionPriority,

    executionWindowMs,

    executionThroughput,

    pacingMode,

    runtimeExecutionAllowed:
      consensus.executionConsensus,

    schedulerStable:
      consensus.executionConsensus,

    recommendation:
      consensus.executionConsensus
        ? 'Runtime execution scheduler active.'
        : 'Runtime execution restricted.',

    reasoning: [
      `priority:${executionPriority}`,
      `window:${executionWindowMs}`,
      `throughput:${executionThroughput}`,
      `pacing:${pacingMode}`,
      `consensus:${consensus.executionConsensus}`,
      `ratio:${consensus.consensusRatio}`,
    ],
  }
}
