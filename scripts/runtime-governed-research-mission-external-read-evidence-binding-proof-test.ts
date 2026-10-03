import assert from 'node:assert/strict';

import { bindGovernedResearchMissionExternalReadEvidence } from '../app/lib/runtime-core/runtime-governed-research-mission-external-read-evidence-binding';

const base = {
  missionId: 'research-mission-proof',
  missionExecutionKey: 'execution-proof',
  missionCorrelationId: 'correlation-proof',
  missionTraceId: 'trace-proof',
  missionStepId: 'step-proof',
  evidenceId: 'evidence-proof',
  evidenceExecutionKey: 'execution-proof',
  evidenceCorrelationId: 'correlation-proof',
  evidenceTraceId: 'trace-proof',
  evidenceStepId: 'step-proof',
  evidenceCreated: true,
  provenanceStatus: 'verified' as const,
};

const bound = bindGovernedResearchMissionExternalReadEvidence(base);

assert.equal(bound.researchMissionEvidenceBound, true);
assert.equal(bound.provenanceVerified, true);
assert.equal(bound.authorityGranted, false);
assert.equal(bound.networkAccess, false);
assert.equal(bound.executionApplied, false);
assert.equal(bound.mutationApplied, false);
assert.equal(bound.memoryApplied, false);
assert.equal(bound.learningApplied, false);

for (const blocked of [
  { ...base, missionExecutionKey: 'mismatch' },
  { ...base, missionCorrelationId: 'mismatch' },
  { ...base, missionTraceId: 'mismatch' },
  { ...base, missionStepId: 'mismatch' },
  { ...base, evidenceCreated: false },
]) {
  const result = bindGovernedResearchMissionExternalReadEvidence(blocked);
  assert.equal(result.researchMissionEvidenceBound, false);
  assert.equal(result.authorityGranted, false);
  assert.equal(result.networkAccess, false);
  assert.equal(result.mutationApplied, false);
}

console.log('V287_83_RESEARCH_MISSION_EXTERNAL_READ_EVIDENCE_BINDING_PROOF=PASS');
console.log('CANONICAL_EVIDENCE=REUSED');
console.log('NEW_AUTHORITY=FALSE');
console.log('NEW_EXECUTOR=FALSE');
console.log('NEW_NETWORK_STACK=FALSE');
console.log('MUTATION_APPLIED=FALSE');
console.log('MEMORY_APPLIED=FALSE');
console.log('LEARNING_APPLIED=FALSE');
