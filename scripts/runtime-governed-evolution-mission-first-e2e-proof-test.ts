import assert from 'node:assert/strict';

import {
  runGovernedEvolutionMissionFirstE2E,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-first-e2e';

async function main(): Promise<void> {
  const result = await runGovernedEvolutionMissionFirstE2E({
    missionId: 'mission-v2877414-architecture-technology-gap-analysis',
    objectiveId: 'objective-v2877414-architecture-technology-gap-analysis',
    objective:
      'Analyze IASevero architecture and proven evidence, identify concrete technology and architecture gaps, and produce governed improvement proposals without operational mutation.',
  });

  assert.equal(result.missionId, 'mission-v2877414-architecture-technology-gap-analysis');
  assert.equal(result.objectiveId, 'objective-v2877414-architecture-technology-gap-analysis');

  assert.equal(result.cognitiveCycleCompleted, true);
  assert.equal(result.selfDevelopmentAssessmentCompleted, true);
  assert.equal(result.checkpointApplied, true);
  assert.equal(result.missionStatePersisted, true);
  assert.equal(result.leaseRenewalApplied, true);

  assert.equal(result.executionAuthorityGranted, false);
  assert.equal(result.networkAuthorityGranted, false);
  assert.equal(result.sandboxAuthorityGranted, false);
  assert.equal(result.productionMutationAllowed, false);
  assert.equal(result.selfPromotionAllowed, false);

  assert.ok(
    result.nextState === 'continue' ||
      result.nextState === 'waiting_authorization' ||
      result.nextState === 'completed',
  );

  console.log(
    'V287_74_14_GOVERNED_EVOLUTION_MISSION_FIRST_E2E_PROOF=PASS',
  );
  console.log(result);
}

void main();
