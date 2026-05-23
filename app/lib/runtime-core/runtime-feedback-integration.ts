import { runRuntimeMemoryPersistenceLoop } from './runtime-memory-persistence-loop'
import { superviseRuntimeAutonomously } from './runtime-autonomous-supervisor'
import { emitRuntimeTelemetry } from './runtime-telemetry-fabric'

export type RuntimeFeedbackLevel =
  | 'optimized'
  | 'stable'
  | 'warning'
  | 'critical'

export type RuntimeFeedbackIntegration = {
  generatedAt: string
  source: 'runtime-feedback-integration'
  feedbackLevel: RuntimeFeedbackLevel
  adaptiveCorrection: boolean
  memoryInfluence: boolean
  supervisorInfluence: boolean
  recommendation: string
  reasoning: string[]
}

export function integrateRuntimeFeedback():
RuntimeFeedbackIntegration {

  const memory = runRuntimeMemoryPersistenceLoop()

  const supervision =
  superviseRuntimeAutonomously()

  const feedbackLevel =
    memory.stabilityRate >= 90 &&
    supervision.supervisionLevel === 'normal'
      ? 'optimized'
      : memory.stabilityRate >= 70
      ? 'stable'
      : memory.stabilityRate >= 50
      ? 'warning'
      : 'critical'

  const result: RuntimeFeedbackIntegration = {
    generatedAt: new Date().toISOString(),

    source:
      'runtime-feedback-integration' as const,

    feedbackLevel,

    adaptiveCorrection:
      feedbackLevel !== 'optimized',

    memoryInfluence: true,

    supervisorInfluence: true,

    recommendation:
      feedbackLevel === 'optimized'
        ? 'Sistema altamente estável.'
        : feedbackLevel === 'stable'
        ? 'Sistema estável sob observação.'
        : feedbackLevel === 'warning'
        ? 'Correção adaptativa recomendada.'
        : 'Correção crítica imediata.',

    reasoning: [
      ...memory.reasoning,
      ...supervision.reasoning,
      `feedback:${feedbackLevel}`
    ]
  }

  emitRuntimeTelemetry({
    source: 'runtime-feedback-integration',
    type: 'runtime-feedback-cycle',
    severity:
      feedbackLevel === 'critical'
        ? 'critical'
        : feedbackLevel === 'warning'
        ? 'warning'
        : 'info',
    correlationId:
      `feedback-${Date.now()}`,
    message:
      `Feedback integration executed with level ${feedbackLevel}.`,
    payload: {
      feedbackLevel,
      memoryInfluence: true,
      supervisorInfluence: true,
      recommendation: result.recommendation,
    },
  })

  return result
}
