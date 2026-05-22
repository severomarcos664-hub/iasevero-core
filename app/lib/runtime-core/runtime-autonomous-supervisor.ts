import { transitionRuntimeState } from './runtime-state-transition-engine'

export type RuntimeAutonomousSupervisorResult = {
  generatedAt: string
  source: 'runtime-autonomous-supervisor'
  supervisionLevel: 'normal' | 'watch' | 'intervene' | 'critical'
  approved: boolean
  transition: {
    previousState: string
    nextState: string
  }
  recommendation: string
  reasoning: string[]
}

export function superviseRuntimeAutonomously(): RuntimeAutonomousSupervisorResult {
  const transition = transitionRuntimeState()

  const supervisionLevel =
    transition.nextState === 'stable'
      ? 'normal'
      : transition.nextState === 'observing'
        ? 'watch'
        : transition.nextState === 'throttled'
          ? 'intervene'
          : 'critical'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-autonomous-supervisor',
    supervisionLevel,
    approved: supervisionLevel !== 'critical',
    transition: {
      previousState: transition.previousState,
      nextState: transition.nextState,
    },
    recommendation:
      supervisionLevel === 'normal'
        ? 'Supervisor autônomo aprova operação normal.'
        : supervisionLevel === 'watch'
          ? 'Supervisor recomenda observação ampliada.'
          : supervisionLevel === 'intervene'
            ? 'Supervisor recomenda redução ativa de pressão.'
            : 'Supervisor exige contenção crítica imediata.',
    reasoning: [
      ...transition.reasoning,
      `supervision:${supervisionLevel}`,
    ],
  }
}
