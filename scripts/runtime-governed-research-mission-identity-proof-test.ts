import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ownerPath =
  'app/lib/runtime-core/runtime-governed-research-mission-identity.ts';

const owner = readFileSync(ownerPath, 'utf8');

assert.match(owner, /createHash\(['"]sha256['"]\)/);
assert.match(owner, /iasevero:governed-research-mission:v1/);
assert.match(owner, /objective/);
assert.match(owner, /trim\(\)/);
assert.doesNotMatch(owner, /randomUUID/);
assert.doesNotMatch(owner, /Date\.now/);
assert.doesNotMatch(owner, /Math\.random/);

const {
  deriveGovernedResearchMissionId,
} = require(
  '../app/lib/runtime-core/runtime-governed-research-mission-identity'
);

assert.equal(
  typeof deriveGovernedResearchMissionId,
  'function',
);

const input = {
  objective: '  research frontier technology  ',
  scope: 'local',
};

const first = deriveGovernedResearchMissionId(input);
const second = deriveGovernedResearchMissionId(input);

assert.equal(first, second);
assert.equal(typeof first, 'string');
assert.ok(first.length > 0);
assert.ok(first.startsWith('research-mission:v1:'));

for (const forbidden of [
  'execution-key',
  'correlation-id',
  'trace-id',
  'task-id',
]) {
  assert.notEqual(first, forbidden);
}

assert.throws(() =>
  deriveGovernedResearchMissionId({
    objective: '   ',
    scope: 'local',
  }),
);

console.log('V287_81_RESEARCH_MISSION_IDENTITY_OWNER_PROOF=PASS');
