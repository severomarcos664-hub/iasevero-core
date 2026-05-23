import { evaluateRuntimePolicy } from './runtime-policy-engine'

export type RuntimeSchedulePriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'

export type RuntimeAdaptiveSchedule = {
  generatedAt: string
  source: 'runtime-adaptive-scheduler'
  priority: RuntimeSchedulePriority
  scheduledAction: string
  executeImmediately: boolean
  delayMs: number
  recommendation: string
  reasoning: string[]
}

export function scheduleRuntimeExecution():
RuntimeAdaptiveSchedule {

  const policy = evaluateRuntimePolicy()

  const priority: RuntimeSchedulePriority =
    policy.policyLevel === 'critical'
      ? 'critical'
      : policy.policyLevel === 'restricted'
        ? 'high'
        : policy.policyLevel === 'preventive'
          ? 'high'
          : policy.policyLevel === 'observe'
            ? 'normal'
            : 'low'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-adaptive-scheduler',
    priority,
    scheduledAction: policy.requiredAction,
    executeImmediately:
      priority === 'critical' ||
      priority === 'high',
    delayMs:
      priority === 'critical'
        ? 0
        : priority === 'high'
          ? 250
          : priority === 'normal'
            ? 1000
            : 3000,
    recommendation:
      priority === 'critical'
        ? 'Executar imediatamente.'
        : priority === 'high'
          ? 'Executar com prioridade alta.'
          : priority === 'normal'
            ? 'Agendar execução normal.'
            : 'Executar em baixa prioridade.',
    reasoning: [
      ...policy.reasoning,
      `schedule:${priority}`,
      `delayMs:${
        priority === 'critical'
          ? 0
          : priority === 'high'
            ? 250
            : priority === 'normal'
              ? 1000
              : 3000
      }`,
    ],
  }
}
