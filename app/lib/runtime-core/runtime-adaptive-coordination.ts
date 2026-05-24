export type RuntimeCoordinationMode =
  | 'normal'
  | 'stabilize'
  | 'throttle'
  | 'contain';

export type RuntimeCoordinationInput = {
  governance: 'NORMAL_OPERATION' | 'STABILIZATION_REQUIRED' | 'THROTTLING_REQUIRED' | 'CONTAINMENT_REQUIRED' | 'RECOVERY_REQUIRED';
  evaluationScore: number;
  workflowStable: boolean;
  policyAllowed: boolean;
  resilienceActive: boolean;
};

export type RuntimeCoordinationReport = {
  generatedAt: string;
  source: 'runtime-adaptive-coordination';
  mode: RuntimeCoordinationMode;
  autonomyLevel: 'low' | 'medium' | 'high';
  executionProfile: 'safe' | 'balanced' | 'aggressive';
  orchestrationIntensity: number;
  stabilityGuard: boolean;
  recommendation: string;
  signals: string[];
};

export function coordinateAdaptiveRuntime(input: RuntimeCoordinationInput): RuntimeCoordinationReport {
  const mustContain =
    input.governance === 'CONTAINMENT_REQUIRED' ||
    input.governance === 'RECOVERY_REQUIRED' ||
    !input.policyAllowed ||
    input.evaluationScore < 50;

  const mustThrottle =
    input.governance === 'THROTTLING_REQUIRED' ||
    input.evaluationScore < 70 ||
    input.resilienceActive;

  const mustStabilize =
    input.governance === 'STABILIZATION_REQUIRED' ||
    !input.workflowStable ||
    input.evaluationScore < 85;

  const mode: RuntimeCoordinationMode = mustContain
    ? 'contain'
    : mustThrottle
      ? 'throttle'
      : mustStabilize
        ? 'stabilize'
        : 'normal';

  const autonomyLevel =
    mode === 'normal' ? 'high' : mode === 'stabilize' ? 'medium' : 'low';

  const executionProfile =
    mode === 'normal' && input.evaluationScore >= 90 ? 'aggressive' :
    mode === 'contain' ? 'safe' :
    'balanced';

  const orchestrationIntensity =
    mode === 'normal' ? 100 :
    mode === 'stabilize' ? 70 :
    mode === 'throttle' ? 45 :
    20;

  const recommendation =
    mode === 'normal'
      ? 'Adaptive coordination healthy. Continue governed execution.'
      : mode === 'stabilize'
        ? 'Stabilization recommended. Reduce autonomy and monitor workflow quality.'
        : mode === 'throttle'
          ? 'Throttling recommended. Limit execution intensity and preserve stability.'
          : 'Containment required. Block unsafe execution and validate recovery path.';

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-adaptive-coordination',
    mode,
    autonomyLevel,
    executionProfile,
    orchestrationIntensity,
    stabilityGuard: mode !== 'normal',
    recommendation,
    signals: [
      `governance:${input.governance}`,
      `evaluation:${input.evaluationScore}`,
      `workflowStable:${input.workflowStable}`,
      `policyAllowed:${input.policyAllowed}`,
      `resilienceActive:${input.resilienceActive}`,
      `mode:${mode}`,
    ],
  };
}
