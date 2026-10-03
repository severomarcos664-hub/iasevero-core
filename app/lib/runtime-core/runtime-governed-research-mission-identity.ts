import { createHash } from 'node:crypto';

const RESEARCH_MISSION_IDENTITY_DOMAIN =
  'iasevero:governed-research-mission:v1';

export type GovernedResearchMissionIdentityInput = {
  objective: string;
  scope: string;
};

function requireNormalizedIdentityField(
  value: string,
  field: string,
): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(
      `Governed research mission identity requires non-empty ${field}.`,
    );
  }

  return normalized;
}

export function deriveGovernedResearchMissionId(
  input: GovernedResearchMissionIdentityInput,
): string {
  const objective =
    requireNormalizedIdentityField(input.objective, 'objective');

  const scope =
    requireNormalizedIdentityField(input.scope, 'scope');

  const canonicalMaterial = JSON.stringify({
    domain: RESEARCH_MISSION_IDENTITY_DOMAIN,
    scope,
    objective,
  });

  const digest = createHash('sha256')
    .update(canonicalMaterial, 'utf8')
    .digest('hex');

  return `research-mission:v1:${digest}`;
}
