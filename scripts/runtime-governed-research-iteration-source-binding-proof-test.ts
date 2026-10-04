import assert from 'node:assert/strict';

import { bindGovernedResearchIterationSource } from '../app/lib/runtime-core/runtime-governed-research-iteration-source-binding';

const base = {
  missionId: 'research-mission-001',
  researchIteration: 0,
  maximumResearchIterations: 3,
  sourceEvaluated: true,
  sourceConfigured: true,
  sourceId: 'https://example.org/research',
};

const bound = bindGovernedResearchIterationSource(base);

assert.equal(bound.researchIterationSourceBound, true);
assert.equal(bound.sourceEvaluationVerified, true);
assert.equal(bound.iterationEligible, true);

assert.equal(bound.authorityGranted, false);
assert.equal(bound.networkAccess, false);
assert.equal(bound.executionApplied, false);
assert.equal(bound.mutationApplied, false);
assert.equal(bound.memoryApplied, false);
assert.equal(bound.learningApplied, false);

assert.equal(
  bindGovernedResearchIterationSource({
    ...base,
    missionId: '',
  }).researchIterationSourceBound,
  false,
);

assert.equal(
  bindGovernedResearchIterationSource({
    ...base,
    researchIteration: 3,
  }).researchIterationSourceBound,
  false,
);

assert.equal(
  bindGovernedResearchIterationSource({
    ...base,
    sourceEvaluated: false,
  }).researchIterationSourceBound,
  false,
);

assert.equal(
  bindGovernedResearchIterationSource({
    ...base,
    sourceConfigured: false,
  }).researchIterationSourceBound,
  false,
);

assert.equal(
  bindGovernedResearchIterationSource({
    ...base,
    sourceId: null,
  }).researchIterationSourceBound,
  false,
);

console.log('V287_85_RESEARCH_ITERATION_SOURCE_BINDING_PROOF=PASS');
console.log('SOURCE_AUTHORITY=FALSE');
console.log('NETWORK_ACCESS=FALSE');
console.log('EXECUTION_APPLIED=FALSE');
console.log('MUTATION_APPLIED=FALSE');
console.log('MEMORY_APPLIED=FALSE');
console.log('LEARNING_APPLIED=FALSE');
