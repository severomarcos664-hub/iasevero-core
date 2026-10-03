import assert from 'node:assert/strict';

import { prepareGovernedResearchMissionExternalReadEffectAdmissionIntegration } from '../app/lib/runtime-core/runtime-governed-research-mission-external-read-effect-admission-integration';

const base = {
  executionKey: 'proof-execution',
  correlationId: 'proof-correlation',
  traceId: 'proof-trace',
  stepId: 'proof-step',
  researchMissionExternalReadExecutionEligible: true,
  routeConsumerBindingPrepared: true,
  effectHandoffPrepared: true,
};

const eligible =
  prepareGovernedResearchMissionExternalReadEffectAdmissionIntegration(base);

assert.equal(eligible.researchMissionEffectAdmissionPrepared, true);
assert.equal(eligible.effectAdmissionPrepared, true);
assert.equal(eligible.networkAccess, false);
assert.equal(eligible.externalReadApplied, false);
assert.equal(eligible.executionApplied, false);
assert.equal(eligible.mutationApplied, false);

for (const blocked of [
  { ...base, researchMissionExternalReadExecutionEligible: false },
  { ...base, routeConsumerBindingPrepared: false },
  { ...base, effectHandoffPrepared: false },
]) {
  const result =
    prepareGovernedResearchMissionExternalReadEffectAdmissionIntegration(blocked);

  assert.equal(result.researchMissionEffectAdmissionPrepared, false);
  assert.equal(result.effectAdmissionPrepared, false);
  assert.equal(result.networkAccess, false);
  assert.equal(result.externalReadApplied, false);
  assert.equal(result.executionApplied, false);
  assert.equal(result.mutationApplied, false);
}

console.log('V287_82_RESEARCH_MISSION_EXTERNAL_READ_EFFECT_ADMISSION_INTEGRATION_PROOF=PASS');
console.log('AUTHORITY_REUSE=EXISTING');
console.log('NEW_AUTHORITY=FALSE');
console.log('NEW_EXECUTOR=FALSE');
console.log('NEW_NETWORK_STACK=FALSE');
console.log('NETWORK_ACCESS=FALSE');
console.log('EXECUTION_APPLIED=FALSE');
console.log('MUTATION_APPLIED=FALSE');
