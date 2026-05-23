import { validateRuntimeIntegrity } from './runtime-integrity-validator'
import { recoverRuntimeState } from './runtime-recovery-engine'
import { replayRuntimeState } from './runtime-state-replay-engine'
import { evaluateRuntimeGovernanceCenter } from './runtime-governance-center'

export type RuntimeSelfHealingDecision =
  | 'NO_HEALING_REQUIRED'
  | 'REPLAY_RECOMMENDED'
  | 'RECOVERY_RECOMMENDED'
  | 'CONTAINMENT_REQUIRED'

export type RuntimeSelfHealingReport = {
  generatedAt: string
  source: 'runtime-self-healing-coordinator'
  decision: RuntimeSelfHealingDecision
  healingRequired: boolean
  automaticExecutionAllowed: boolean
  recommendation: string
  reasoning: string[]
}

export function coordinateRuntimeSelfHealing():
RuntimeSelfHealingReport {

  const integrity = validateRuntimeIntegrity()
  const recovery = recoverRuntimeState()
  const replay = replayRuntimeState()
  const governance = evaluateRuntimeGovernanceCenter()

  const decision: RuntimeSelfHealingDecision =
    integrity.integrity === 'critical' ||
    recovery.operationalState === 'critical' ||
    governance.decision === 'CONTAINMENT_REQUIRED'
      ? 'CONTAINMENT_REQUIRED'
      : integrity.integrity === 'partial' ||
        recovery.operationalState === 'partial'
        ? 'RECOVERY_RECOMMENDED'
        : replay.replayHealth === 'partial'
          ? 'REPLAY_RECOMMENDED'
          : 'NO_HEALING_REQUIRED'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-self-healing-coordinator',

    decision,

    healingRequired:
      decision !== 'NO_HEALING_REQUIRED',

    automaticExecutionAllowed:
      decision === 'NO_HEALING_REQUIRED' ||
      decision === 'REPLAY_RECOMMENDED',

    recommendation:
      decision === 'CONTAINMENT_REQUIRED'
        ? 'Self-healing detectou risco crítico: contenção recomendada.'
        : decision === 'RECOVERY_RECOMMENDED'
          ? 'Self-healing recomenda recuperação operacional controlada.'
          : decision === 'REPLAY_RECOMMENDED'
            ? 'Self-healing recomenda replay causal antes de nova execução.'
            : 'Self-healing não necessário; runtime íntegro.',

    reasoning: [
      ...integrity.reasoning,
      ...recovery.reasoning,
      ...replay.reasoning,
      ...governance.reasoning,
      `selfHealing:${decision}`,
    ],
  }
}
