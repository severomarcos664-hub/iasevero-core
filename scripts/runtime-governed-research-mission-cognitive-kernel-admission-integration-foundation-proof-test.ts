import assert from 'node:assert/strict';
import { createGovernedResearchMissionContract } from '../app/lib/runtime-core/runtime-governed-research-mission-contract';
import { evaluateGovernedResearchMissionCognitiveKernelAdmissionIntegration } from '../app/lib/runtime-core/runtime-governed-research-mission-cognitive-kernel-admission-integration';

const contract = createGovernedResearchMissionContract({
  missionId: 'mission-v287-78-proof',
  objective: 'Research advanced technology under governed cognitive admission.',
  executionKey: 'execution-v287-78-proof',
  correlationId: 'correlation-v287-78-proof',
  traceId: 'trace-v287-78-proof',
  stepId: 'step-v287-78-proof',
});

const decision =
  evaluateGovernedResearchMissionCognitiveKernelAdmissionIntegration({
    contract,
  });

assert.equal(decision.schemaVersion, 1);
assert.equal(
  decision.kind,
  'iasevero-governed-research-mission-cognitive-kernel-admission-integration',
);

assert.equal(decision.researchMissionContractVerified, true);
assert.equal(decision.researchMissionContractEligible, true);
assert.equal(decision.missionIdentityBound, true);
assert.equal(decision.correlationIdentityBound, true);
assert.equal(decision.researchMissionCognitiveKernelAdmissionEligible, true);

assert.equal(decision.missionId, contract.missionId);
assert.equal(decision.executionKey, contract.executionKey);
assert.equal(decision.correlationId, contract.correlationId);
assert.equal(decision.traceId, contract.traceId);
assert.equal(decision.stepId, contract.stepId);

assert.equal(decision.researchAuthorityGranted, false);
assert.equal(decision.networkAuthorityGranted, false);
assert.equal(decision.networkAccess, false);
assert.equal(decision.externalReadApplied, false);
assert.equal(decision.executionApplied, false);
assert.equal(decision.mutationApplied, false);
assert.equal(decision.memoryApplied, false);
assert.equal(decision.learningApplied, false);
assert.equal(decision.technologyAcquired, false);
assert.equal(decision.technologyInstalled, false);
assert.equal(decision.productionMutationApplied, false);
assert.equal(decision.selfPromotionApplied, false);

console.log(
  'Governed Research Mission cognitive-kernel admission integration foundation proof passed.',
);
