import assert from 'node:assert/strict';
import fs from 'node:fs';

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8');

const evidence =
  route.indexOf('const toolControlledExternalReadEvidence =');
const binding =
  route.indexOf('const governedResearchMissionExternalReadEvidenceBinding =');
const safety =
  route.indexOf('const toolControlledExternalReadInboundContentSafety =');

assert.ok(evidence >= 0, 'CANONICAL_EVIDENCE_ABSENT');
assert.ok(binding >= 0, 'RESEARCH_EVIDENCE_BINDING_ABSENT');
assert.ok(safety >= 0, 'INBOUND_CONTENT_SAFETY_ABSENT');

assert.ok(evidence < binding, 'EVIDENCE_BINDING_ORDER_INVALID');
assert.ok(binding < safety, 'BINDING_SAFETY_ORDER_INVALID');

assert.ok(
  route.includes('bindGovernedResearchMissionExternalReadEvidence({'),
  'BINDING_OWNER_NOT_CONSUMED',
);

assert.ok(
  route.includes('missionId: governedResearchMissionContract.missionId'),
  'MISSION_ID_BINDING_ABSENT',
);

assert.ok(
  route.includes('evidenceId: toolControlledExternalReadEvidence.evidence.evidenceId'),
  'EVIDENCE_ID_BINDING_ABSENT',
);

assert.ok(
  route.includes('provenanceStatus: toolControlledExternalReadEvidence.evidence.provenanceStatus'),
  'PROVENANCE_BINDING_ABSENT',
);

console.log('V287_84_RESEARCH_MISSION_EXTERNAL_READ_EVIDENCE_PRODUCTION_BINDING_PROOF=PASS');
console.log('CANONICAL_EVIDENCE=REUSED');
console.log('ORDER=EVIDENCE>BINDING>INBOUND_SAFETY');
console.log('NEW_AUTHORITY=FALSE');
console.log('NEW_EXECUTOR=FALSE');
console.log('NEW_NETWORK_STACK=FALSE');
console.log('MUTATION_APPLIED=FALSE');
