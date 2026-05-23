import { evaluateRuntimeGovernanceCenter } from './runtime-governance-center'
import { validateRuntimeIntegrity } from './runtime-integrity-validator'
import { evaluateRuntimePolicy } from './runtime-policy-engine'
import { scheduleRuntimeExecution } from './runtime-adaptive-scheduler'
import { superviseRuntimeLanes } from './runtime-lane-supervisor'
import { coordinateRuntimeSelfHealing } from './runtime-self-healing-coordinator'
import { recoverRuntimeState } from './runtime-recovery-engine'

export function runRuntimeMasterOrchestrator() {
  const governance = evaluateRuntimeGovernanceCenter()
  const integrity = validateRuntimeIntegrity()
  const policy = evaluateRuntimePolicy()
  const scheduler = scheduleRuntimeExecution()
  const lanes = superviseRuntimeLanes()
  const healing = coordinateRuntimeSelfHealing()
  const recovery = recoverRuntimeState()

  const operationalState =
    integrity.integrity === 'healthy' &&
    governance.decision === 'NORMAL_OPERATION'
      ? 'stable'
      : 'attention'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-master-orchestrator',

    operationalState,

    governance,
    integrity,
    policy,
    scheduler,
    lanes,
    healing,
    recovery,

    recommendation:
      operationalState === 'stable'
        ? 'Runtime operacional convergente.'
        : 'Runtime requer atenção.',

    reasoning: [
      `state:${operationalState}`,
      `decision:${governance.decision}`,
      `integrity:${integrity.integrity}`,
      `policy:${policy.policyLevel}`,
      `healing:${healing.decision}`,
    ],
  }
}
