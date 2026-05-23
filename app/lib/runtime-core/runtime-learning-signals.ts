import {
  evaluateRuntimeExecutionQuality,
} from './runtime-evaluation-engine'

export type RuntimeLearningSignal = {
  signalId: string
  createdAt: string
  source: 'runtime-learning-signals'
  operationalPattern:
    | 'excellent'
    | 'healthy'
    | 'degraded'
    | 'critical'
  executionScore: number
  learningPriority:
    | 'low'
    | 'medium'
    | 'high'
  optimizationRecommended: boolean
  reasoning: string[]
}

export function generateRuntimeLearningSignal():
RuntimeLearningSignal {

  const evaluation =
    evaluateRuntimeExecutionQuality()

  const optimizationRecommended =
    evaluation.overallScore < 85

  return {
    signalId: `signal_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-learning-signals',

    operationalPattern:
      evaluation.quality,

    executionScore:
      evaluation.overallScore,

    learningPriority:
      evaluation.overallScore >= 90
        ? 'low'
        : evaluation.overallScore >= 70
          ? 'medium'
          : 'high',

    optimizationRecommended,

    reasoning: [
      `quality:${evaluation.quality}`,
      `overall:${evaluation.overallScore}`,
      `optimization:${optimizationRecommended}`,
    ],
  }
}
