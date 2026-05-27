import {
  evaluateRuntimeExecutionGovernanceMatrix,
} from '@/app/lib/runtime-governance-matrix/runtime-execution-governance-matrix'

import {
  coordinateAdaptiveRuntime,
} from '@/app/lib/runtime-core/runtime-adaptive-coordination'

export function evaluateRuntimeAdaptiveDecisionLayer() {
  const matrix = evaluateRuntimeExecutionGovernanceMatrix()

  const coordination = coordinateAdaptiveRuntime({
    governance: matrix.globalExecutionAllowed
      ? 'NORMAL_OPERATION'
      : 'STABILIZATION_REQUIRED',
    evaluationScore: matrix.governanceScore,
    workflowStable: matrix.cognitiveStable,
    policyAllowed: matrix.globalExecutionAllowed,
    resilienceActive: matrix.executionConsensus,
  })

  const adaptiveDecision =
    coordination.mode === 'normal'
      ? 'continue-advanced-execution'
      : coordination.mode === 'stabilize'
        ? 'stabilize-runtime-before-execution'
        : coordination.mode === 'throttle'
          ? 'reduce-runtime-intensity'
          : 'contain-runtime-execution'

  return {
    decisionId: `adaptive-decision-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-adaptive-decision-layer',

    adaptiveDecision,
    coordinationMode: coordination.mode,
    autonomyLevel: coordination.autonomyLevel,
    executionProfile: coordination.executionProfile,
    orchestrationIntensity: coordination.orchestrationIntensity,

    governanceMode: matrix.governanceMode,
    governanceScore: matrix.governanceScore,
    globalExecutionAllowed: matrix.globalExecutionAllowed,

    runtimeStable: coordination.stabilityGuard,
    recommendation: coordination.recommendation,

    reasoning: [
      `decision:${adaptiveDecision}`,
      `coordination:${coordination.mode}`,
      `autonomy:${coordination.autonomyLevel}`,
      `profile:${coordination.executionProfile}`,
      `intensity:${coordination.orchestrationIntensity}`,
      `governance:${matrix.governanceMode}`,
      `score:${matrix.governanceScore}`,
      `allowed:${matrix.globalExecutionAllowed}`,
    ],
  }
}
