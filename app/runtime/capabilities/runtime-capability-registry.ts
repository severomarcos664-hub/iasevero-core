export const RUNTIME_CAPABILITIES = {
  governance: [
    'approve-execution',
    'deny-execution',
    'validate-provider',
    'validate-policy',
    'read-runtime-state',
  ],

  execution: [
    'execute-approved-action',
    'resolve-provider',
    'route-runtime-request',
  ],

  observability: [
    'observe-runtime',
    'emit-telemetry',
    'report-incidents',
    'collect-metrics',
  ],

  intelligence: [
    'analyze-runtime',
    'evaluate-runtime-health',
    'suggest-runtime-actions',
  ],

  autonomy: [
    'request-recovery',
    'request-stabilization',
    'request-self-healing',
  ],

  validation: [
    'validate-topology',
    'validate-dependencies',
    'validate-runtime-structure',
  ],
} as const;

export type AppliedIntelligenceCapabilityStatus =
  | 'proved'
  | 'partially-proved'
  | 'audit-required'
  | 'roadmap'
  | 'directive'
  | 'foundation';

export type AppliedIntelligenceCapability = {
  id: string;
  name: string;
  status: AppliedIntelligenceCapabilityStatus;
  evidenceIds: readonly string[];
  limitations: readonly string[];
  canonicalOwner: string;
  localFirst: boolean;
  externalProviderRequired: boolean;
  implementationClaim: boolean;
};

export type AppliedIntelligenceCapabilityMatrixValidation = {
  valid: boolean;
  totalCapabilities: number;
  provedCapabilities: number;
  partiallyProvedCapabilities: number;
  auditRequiredCapabilities: number;
  roadmapCapabilities: number;
  directiveCapabilities: number;
  foundationCapabilities: number;
  errors: string[];
};

export const APPLIED_INTELLIGENCE_CAPABILITY_MATRIX = [
  {
    id: 'tool-registry-governance',
    name: 'Tool Registry and governed tool selection',
    status: 'partially-proved',
    evidenceIds: [
      'v284.0-governed-tool-registry-foundation-proof',
      'v284.1-governed-tool-registry-api-integration-proof',
      'v284.2-governed-tool-availability-canonicalization-proof',
    ],
    limitations: [
      'Complete governed execution of real tools is not yet proved.',
    ],
    canonicalOwner: 'app/lib/runtime-core/runtime-tool-registry.ts',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'runtime-trace-integrity',
    name: 'Distributed runtime trace integrity',
    status: 'proved',
    evidenceIds: [
      'v284.4-governed-runtime-trace-integrity-proof',
    ],
    limitations: [
      'Cryptographic persistence and multi-instance integrity are not proved.',
    ],
    canonicalOwner:
      'app/lib/runtime-core/runtime-distributed-trace-engine.ts',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: true,
  },
  {
    id: 'multi-step-planning',
    name: 'Governed multi-step planning',
    status: 'partially-proved',
    evidenceIds: [],
    limitations: [
      'End-to-end planning, replanning and result verification remain incomplete.',
    ],
    canonicalOwner: 'app/lib/runtime-core/runtime-task-planner.ts',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'rag-and-verifiable-citations',
    name: 'RAG and verifiable citations',
    status: 'audit-required',
    evidenceIds: [],
    limitations: [
      'Canonical retrieval, citation and provenance path must be audited.',
    ],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'continuous-cognitive-evaluation',
    name: 'Continuous cognitive evaluation',
    status: 'roadmap',
    evidenceIds: [],
    limitations: [
      'Permanent evaluation fabric is not yet proved.',
    ],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'intelligent-provider-routing',
    name: 'Governed intelligent provider routing',
    status: 'partially-proved',
    evidenceIds: [],
    limitations: [
      'Dynamic quality, cost and privacy routing remains to be proved.',
    ],
    canonicalOwner: 'app/lib/runtime-core/runtime-provider-governor.ts',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'corporate-integrations',
    name: 'Governed corporate integrations',
    status: 'roadmap',
    evidenceIds: [],
    limitations: [
      'Email, calendar, CRM, ERP and messaging integrations are not implemented.',
    ],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'broad-multimodality',
    name: 'Broad multimodality',
    status: 'roadmap',
    evidenceIds: [],
    limitations: [
      'Image, audio, voice and video paths require governed proofs.',
    ],
    canonicalOwner: 'not-confirmed',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'local-first-efficiency',
    name: 'Local-first computational efficiency',
    status: 'directive',
    evidenceIds: [],
    limitations: [
      'Cache, latency, token and resource gains must be measured.',
    ],
    canonicalOwner: 'runtime-governance',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
  {
    id: 'governed-executing-agents',
    name: 'Governed executing agents',
    status: 'foundation',
    evidenceIds: [],
    limitations: [
      'Complete autonomous task execution is not proved.',
    ],
    canonicalOwner: 'runtime-execution-chain',
    localFirst: true,
    externalProviderRequired: false,
    implementationClaim: false,
  },
] as const satisfies readonly AppliedIntelligenceCapability[];

export function validateAppliedIntelligenceCapabilityMatrix(
  matrix: readonly AppliedIntelligenceCapability[] =
    APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
): AppliedIntelligenceCapabilityMatrixValidation {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const capability of matrix) {
    if (seenIds.has(capability.id)) {
      errors.push(`Duplicate capability id: ${capability.id}`);
    }

    seenIds.add(capability.id);

    if (
      capability.status === 'proved' &&
      capability.evidenceIds.length === 0
    ) {
      errors.push(
        `Proved capability requires evidenceIds: ${capability.id}`,
      );
    }

    if (
      capability.status === 'roadmap' &&
      capability.implementationClaim
    ) {
      errors.push(
        `Roadmap capability cannot claim implementation: ${capability.id}`,
      );
    }

    if (
      capability.status === 'audit-required' &&
      capability.implementationClaim
    ) {
      errors.push(
        `Audit-required capability cannot claim implementation: ${capability.id}`,
      );
    }

    if (capability.externalProviderRequired) {
      errors.push(
        `External provider cannot be mandatory: ${capability.id}`,
      );
    }

    if (!capability.localFirst) {
      errors.push(
        `Capability must preserve local-first direction: ${capability.id}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    totalCapabilities: matrix.length,
    provedCapabilities: matrix.filter(
      (capability) => capability.status === 'proved',
    ).length,
    partiallyProvedCapabilities: matrix.filter(
      (capability) => capability.status === 'partially-proved',
    ).length,
    auditRequiredCapabilities: matrix.filter(
      (capability) => capability.status === 'audit-required',
    ).length,
    roadmapCapabilities: matrix.filter(
      (capability) => capability.status === 'roadmap',
    ).length,
    directiveCapabilities: matrix.filter(
      (capability) => capability.status === 'directive',
    ).length,
    foundationCapabilities: matrix.filter(
      (capability) => capability.status === 'foundation',
    ).length,
    errors,
  };
}

export type AppliedIntelligenceCapabilityEligibilityReport = {
  found: boolean
  capabilityId: string
  status: AppliedIntelligenceCapabilityStatus | null
  implementationClaim: boolean
  evidenceIds: readonly string[]
  localFirst: boolean
  externalProviderRequired: boolean
  eligibleForAppliedUse: boolean
  executionAuthorized: false
  reason: string
}

export function getAppliedIntelligenceCapabilityEligibility(
  capabilityId: string,
): AppliedIntelligenceCapabilityEligibilityReport {
  const capability = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    (candidate) => candidate.id === capabilityId,
  )

  if (!capability) {
    return {
      found: false,
      capabilityId,
      status: null,
      implementationClaim: false,
      evidenceIds: [],
      localFirst: false,
      externalProviderRequired: false,
      eligibleForAppliedUse: false,
      executionAuthorized: false,
      reason: 'Capability not found in the governed capability matrix.',
    }
  }

  const eligibleForAppliedUse =
    capability.status === 'proved' &&
    capability.implementationClaim &&
    capability.evidenceIds.length > 0 &&
    capability.localFirst &&
    !capability.externalProviderRequired

  return {
    found: true,
    capabilityId: capability.id,
    status: capability.status,
    implementationClaim: capability.implementationClaim,
    evidenceIds: [...capability.evidenceIds],
    localFirst: capability.localFirst,
    externalProviderRequired: capability.externalProviderRequired,
    eligibleForAppliedUse,
    executionAuthorized: false,
    reason: eligibleForAppliedUse
      ? 'Capability is proved and eligible for governed applied use; execution authorization remains external.'
      : 'Capability is not eligible for governed applied use under the current capability evidence.',
  }
}

export type AppliedIntelligenceCapabilityDecision =
  | 'eligible'
  | 'ineligible'
  | 'unknown'

export type AppliedIntelligenceCapabilityDecisionReport = {
  capabilityId: string
  decision: AppliedIntelligenceCapabilityDecision
  capabilityFound: boolean
  eligibilityResolved: boolean
  decisionDerivedFromEligibility: true
  eligibleForAppliedUse: boolean
  executionAuthorized: false
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  reason: string
}

export function decideAppliedIntelligenceCapability(
  capabilityId: string,
): AppliedIntelligenceCapabilityDecisionReport {
  const eligibility =
    getAppliedIntelligenceCapabilityEligibility(capabilityId)

  const decision: AppliedIntelligenceCapabilityDecision =
    !eligibility.found
      ? 'unknown'
      : eligibility.eligibleForAppliedUse
        ? 'eligible'
        : 'ineligible'

  return {
    capabilityId,
    decision,
    capabilityFound: eligibility.found,
    eligibilityResolved: true,
    decisionDerivedFromEligibility: true,
    eligibleForAppliedUse: eligibility.eligibleForAppliedUse,
    executionAuthorized: false,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    reason:
      decision === 'eligible'
        ? 'Capability eligibility supports governed applied use; execution authorization remains external.'
        : decision === 'unknown'
          ? 'Capability is not present in the governed capability matrix.'
          : 'Capability eligibility does not support governed applied use.',
  }
}

export type AppliedIntelligenceCapabilityAuthorizationAssessment = {
  capabilityId: string
  decision: AppliedIntelligenceCapabilityDecision
  capabilityFound: boolean
  eligibilityResolved: true
  decisionResolved: true
  authorizationAssessed: true
  executionAuthorized: false
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  reason: string
}

export function assessAppliedIntelligenceCapabilityAuthorization(
  capabilityId: string
): AppliedIntelligenceCapabilityAuthorizationAssessment {
  const decision = decideAppliedIntelligenceCapability(capabilityId)

  return {
    capabilityId,
    decision: decision.decision,
    capabilityFound: decision.capabilityFound,
    eligibilityResolved: true,
    decisionResolved: true,
    authorizationAssessed: true,
    executionAuthorized: false,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    reason:
      decision.decision === 'eligible'
        ? 'Capability decision is eligible, but execution authorization remains external.'
        : decision.decision === 'unknown'
          ? 'Capability is not present in the governed capability matrix; execution is not authorized.'
          : 'Capability decision is ineligible; execution is not authorized.',
  }
}
