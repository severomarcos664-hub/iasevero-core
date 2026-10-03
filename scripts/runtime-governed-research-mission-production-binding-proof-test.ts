import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const route = readFileSync('app/api/chat/route.ts', 'utf8');

const required = [
  'createGovernedResearchMissionContract',
  'evaluateGovernedResearchMissionCognitiveKernelAdmissionIntegration',
  'prepareGovernedResearchMissionExternalReadCapabilityRequestIntegration',
  'integrateGovernedResearchMissionExternalReadAuthorization',
];

for (const symbol of required) {
  assert.equal(
    route.includes(symbol),
    true,
    `production route must bind existing owner: ${symbol}`,
  );
}

const contract =
  /const\s+governedResearchMissionContract\s*=\s*createGovernedResearchMissionContract\s*\(/.exec(route)?.index ?? -1;

const admission =
  /const\s+governedResearchMissionCognitiveKernelAdmission\s*=\s*evaluateGovernedResearchMissionCognitiveKernelAdmissionIntegration\s*\(/.exec(route)?.index ?? -1;

const requestTarget =
  /const\s+toolControlledExternalReadRequestTarget\s*=\s*evaluateRuntimeToolControlledExternalReadRequestTargetContract\s*\(/.exec(route)?.index ?? -1;

const targetInputBoundary =
  /const\s+toolControlledExternalReadTargetInputBoundary\s*=/.exec(route)?.index ?? -1;

const capability =
  /const\s+governedResearchMissionExternalReadCapabilityRequest\s*=/.exec(route)?.index ?? -1;

const authorization =
  /const\s+researchMissionExternalReadAuthorizationIntegration\s*=\s*integrateGovernedResearchMissionExternalReadAuthorization\s*\(/.exec(route)?.index ?? -1;

assert.equal(contract >= 0, true);
assert.equal(admission > contract, true);
assert.equal(requestTarget > admission, true);
assert.equal(targetInputBoundary > requestTarget, true);
assert.equal(capability > targetInputBoundary, true);
assert.equal(authorization > capability, true);

assert.equal(
  /missionId\s*:\s*(?:effectiveExecutionKey|requestedExecutionKey|[^,\n]*traceId|[^,\n]*correlationId|[^,\n]*taskId)/.test(route),
  false,
  'missionId must not alias execution/trace/correlation/task identity',
);

console.log('V287_81_PRODUCTION_RESEARCH_MISSION_BINDING_PROOF=PASS');
