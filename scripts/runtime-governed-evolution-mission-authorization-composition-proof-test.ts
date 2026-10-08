import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(
  'app/lib/runtime-core/runtime-governed-permanent-evolution-mission-runner.ts',
  'utf8',
);

const authorizationSymbol =
  'evaluateRuntimeGovernedEvolutionProposal' +
  'SandboxAuthorizationIntegration';

assert.ok(
  source.includes(authorizationSymbol),
  'MISSION_AUTHORIZATION_COMPOSITION_MISSING',
);

assert.ok(
  source.includes('selfDevelopmentReport.proposal'),
  'PROPOSAL_BINDING_MISSING',
);

console.log(
  'EVOLUTION_MISSION_AUTHORIZATION_COMPOSITION=PASS',
);
