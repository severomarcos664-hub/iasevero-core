import assert from 'node:assert/strict';

import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  RUNTIME_CAPABILITIES,
  validateAppliedIntelligenceCapabilityMatrix,
  type AppliedIntelligenceCapability,
} from '../app/runtime/capabilities/runtime-capability-registry';

const validation = validateAppliedIntelligenceCapabilityMatrix();

assert.equal(
  validation.valid,
  true,
  `A matriz canônica deve ser válida: ${validation.errors.join(', ')}`,
);

assert.equal(validation.totalCapabilities, 10);
assert.equal(validation.provedCapabilities, 1);
assert.equal(validation.partiallyProvedCapabilities, 3);
assert.equal(validation.auditRequiredCapabilities, 1);
assert.equal(validation.roadmapCapabilities, 3);
assert.equal(validation.directiveCapabilities, 1);
assert.equal(validation.foundationCapabilities, 1);
assert.deepEqual(validation.errors, []);

assert.ok(
  RUNTIME_CAPABILITIES.governance.includes('approve-execution'),
  'A taxonomia operacional anterior deve permanecer preservada.',
);

const traceIntegrity = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
  (capability) => capability.id === 'runtime-trace-integrity',
);

assert.ok(traceIntegrity);
assert.equal(traceIntegrity.status, 'proved');
assert.ok(traceIntegrity.evidenceIds.length > 0);
assert.equal(traceIntegrity.implementationClaim, true);
assert.equal(traceIntegrity.localFirst, true);
assert.equal(traceIntegrity.externalProviderRequired, false);

const ragCapability = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
  (capability) => capability.id === 'rag-and-verifiable-citations',
);

assert.ok(ragCapability);
assert.equal(ragCapability.status, 'audit-required');
assert.equal(ragCapability.implementationClaim, false);

const roadmapCapabilities =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.filter(
    (capability) => capability.status === 'roadmap',
  );

assert.ok(roadmapCapabilities.length > 0);
assert.ok(
  roadmapCapabilities.every(
    (capability) => capability.implementationClaim === false,
  ),
  'Capacidade de roadmap não pode alegar implementação.',
);

assert.ok(
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.every(
    (capability) => capability.localFirst,
  ),
  'Todas as capacidades devem preservar a diretriz local-first.',
);

assert.ok(
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.every(
    (capability) => capability.externalProviderRequired === false,
  ),
  'Nenhuma capacidade pode tornar provider externo obrigatório.',
);

const invalidProvedWithoutEvidence: AppliedIntelligenceCapability[] = [
  {
    id: 'invalid-proved-without-evidence',
    name: 'Invalid proved capability',
    status: 'proved',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'test-owner',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: true,
  },
];

const invalidProvedValidation =
  validateAppliedIntelligenceCapabilityMatrix(
    invalidProvedWithoutEvidence,
  );

assert.equal(invalidProvedValidation.valid, false);
assert.match(
  invalidProvedValidation.errors.join('\n'),
  /Proved capability requires evidenceIds/,
);

const invalidRoadmapClaim: AppliedIntelligenceCapability[] = [
  {
    id: 'invalid-roadmap-claim',
    name: 'Invalid roadmap implementation claim',
    status: 'roadmap',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: true,
  },
];

const invalidRoadmapValidation =
  validateAppliedIntelligenceCapabilityMatrix(invalidRoadmapClaim);

assert.equal(invalidRoadmapValidation.valid, false);
assert.match(
  invalidRoadmapValidation.errors.join('\n'),
  /Roadmap capability cannot claim implementation/,
);

const invalidAuditClaim: AppliedIntelligenceCapability[] = [
  {
    id: 'invalid-audit-claim',
    name: 'Invalid audit-required implementation claim',
    status: 'audit-required',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: true,
  },
];

const invalidAuditValidation =
  validateAppliedIntelligenceCapabilityMatrix(invalidAuditClaim);

assert.equal(invalidAuditValidation.valid, false);
assert.match(
  invalidAuditValidation.errors.join('\n'),
  /Audit-required capability cannot claim implementation/,
);

const invalidExternalProvider: AppliedIntelligenceCapability[] = [
  {
    id: 'invalid-external-provider',
    name: 'Invalid mandatory external provider',
    status: 'directive',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'runtime-governance',
    localFirst: true,
    externalProviderRequired: true,
    implementationClaim: false,
  },
];

const invalidExternalProviderValidation =
  validateAppliedIntelligenceCapabilityMatrix(
    invalidExternalProvider,
  );

assert.equal(invalidExternalProviderValidation.valid, false);
assert.match(
  invalidExternalProviderValidation.errors.join('\n'),
  /External provider cannot be mandatory/,
);

const invalidLocalFirst: AppliedIntelligenceCapability[] = [
  {
    id: 'invalid-local-first',
    name: 'Invalid local-first direction',
    status: 'directive',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'runtime-governance',
    localFirst: false,
    externalProviderRequired: false,
    implementationClaim: false,
  },
];

const invalidLocalFirstValidation =
  validateAppliedIntelligenceCapabilityMatrix(invalidLocalFirst);

assert.equal(invalidLocalFirstValidation.valid, false);
assert.match(
  invalidLocalFirstValidation.errors.join('\n'),
  /Capability must preserve local-first direction/,
);

const duplicateIds: AppliedIntelligenceCapability[] = [
  {
    id: 'duplicate-capability',
    name: 'Duplicate capability A',
    status: 'foundation',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'test-owner',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'duplicate-capability',
    name: 'Duplicate capability B',
    status: 'foundation',
    evidenceIds: [],
    limitations: [],
    canonicalOwner: 'test-owner',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
];

const duplicateValidation =
  validateAppliedIntelligenceCapabilityMatrix(duplicateIds);

assert.equal(duplicateValidation.valid, false);
assert.match(
  duplicateValidation.errors.join('\n'),
  /Duplicate capability id/,
);

console.log(
  'Runtime governed applied intelligence capability matrix proof passed.',
);

console.log({
  matrixValid: validation.valid,
  totalCapabilities: validation.totalCapabilities,
  provedCapabilities: validation.provedCapabilities,
  partiallyProvedCapabilities:
    validation.partiallyProvedCapabilities,
  auditRequiredCapabilities:
    validation.auditRequiredCapabilities,
  roadmapCapabilities: validation.roadmapCapabilities,
  directiveCapabilities: validation.directiveCapabilities,
  foundationCapabilities: validation.foundationCapabilities,
  provedWithoutEvidenceBlocked: true,
  roadmapImplementationClaimBlocked: true,
  auditImplementationClaimBlocked: true,
  mandatoryExternalProviderBlocked: true,
  nonLocalFirstCapabilityBlocked: true,
  duplicateCapabilityIdBlocked: true,
  runtimeCapabilitiesPreserved: true,
  toolsExecuted: false,
  providersActivated: false,
  executionApplied: false,
  mutationApplied: false,
});
