import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

import {
  evaluateRuntimeToolControlledExternalReadContract,
  type RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

let assertionCount = 0
let negativeCount = 0

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  assertionCount += 1

  if (!condition) {
    throw new Error(
      `Assertion failed: ${message}`,
    )
  }
}

function negative(): void {
  negativeCount += 1
}

const envelope: RuntimeToolExecutionInvocationEnvelope = {
  toolId: 'runtime.validation',
  executionKey: 'execution-v2879',
  correlationId: 'correlation-v2879',
  traceId: 'trace-v2879',
  stepId: 'step-v2879',

  validatedInput: {
    query: 'read-only-demo',
  },

  idempotencyKey: 'idempotency-v2879',

  policy: {
    category: 'validation',
    risk: 'low',
    timeoutMs: 1000,
    retries: 0,
    critical: false,
  },

  adapterAccepted: true,
  invocationPrepared: true,

  executionApplied: false,
  mutationApplied: false,
}

const boundary: RuntimeToolControlledExecutorBoundaryDecision = {
  toolId: envelope.toolId,

  executionKey: envelope.executionKey,
  correlationId: envelope.correlationId,
  traceId: envelope.traceId,
  stepId: envelope.stepId,

  invocationPrepared: true,

  toolRegistered: true,
  toolAllowed: true,
  policyMatched: true,

  executorEligible: true,
  executorBoundaryStatus: 'eligible',

  executionApplied: false,
  mutationApplied: false,

  reason:
    'Governed invocation is eligible to cross the controlled executor boundary without executing tool effects.',
}

const baseInput: RuntimeToolControlledExternalReadContractInput = {
  envelope,
  boundary,

  target: {
    protocol: 'https:',
    host: 'example.invalid',
    resource: '/governed/read',
  },

  policy: {
    allowedHosts: [
      'example.invalid',
    ],

    allowedResources: [
      '/governed/read',
    ],

    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  },
}

const eligible =
  evaluateRuntimeToolControlledExternalReadContract(
    baseInput,
  )

assert(
  eligible.contractEligible === true,
  'allowlisted read-only contract must be eligible',
)

assert(
  eligible.contractStatus === 'eligible',
  'eligible contract must expose eligible status',
)

assert(
  eligible.networkAccess === false,
  'contract proof must not access network',
)

assert(
  eligible.externalReadApplied === false,
  'contract proof must not apply external read',
)

assert(
  eligible.executionApplied === false,
  'contract proof must not apply execution',
)

assert(
  eligible.externalMutation === false,
  'contract proof must not grant external mutation',
)

assert(
  eligible.mutationApplied === false,
  'contract proof must not apply mutation',
)

assert(
  eligible.providerInvocation === false,
  'contract proof must not invoke providers',
)

const hostBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    target: {
      ...baseInput.target,
      host: 'blocked.invalid',
    },
  })

negative()

assert(
  hostBlocked.contractEligible === false &&
    hostBlocked.hostAllowed === false,
  'non-allowlisted host must be blocked',
)

const resourceBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    target: {
      ...baseInput.target,
      resource: '/not-allowlisted',
    },
  })

negative()

assert(
  resourceBlocked.contractEligible === false &&
    resourceBlocked.resourceAllowed === false,
  'non-allowlisted resource must be blocked',
)

const protocolBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    target: {
      ...baseInput.target,
      protocol:
        'http:' as 'https:',
    },
  })

negative()

assert(
  protocolBlocked.contractEligible === false &&
    protocolBlocked.targetValid === false,
  'non-HTTPS target must be blocked',
)

const boundaryBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    boundary: {
      ...baseInput.boundary,
      executorEligible: false,
      executorBoundaryStatus: 'blocked',
    },
  })

negative()

assert(
  boundaryBlocked.contractEligible === false &&
    boundaryBlocked.boundaryEligible === false,
  'ineligible controlled boundary must be blocked',
)

const identityBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    boundary: {
      ...baseInput.boundary,
      executionKey: 'different-execution',
    },
  })

negative()

assert(
  identityBlocked.contractEligible === false &&
    identityBlocked.identityMatched === false,
  'execution identity mismatch must be blocked',
)

const costBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    policy: {
      ...baseInput.policy,
      externalCostAllowed:
        true as false,
    },
  })

negative()

assert(
  costBlocked.contractEligible === false &&
    costBlocked.costPolicyMatched === false,
  'external cost authorization must fail closed in this contract',
)

const secretBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    policy: {
      ...baseInput.policy,
      secretsPermitted:
        true as false,
    },
  })

negative()

assert(
  secretBlocked.contractEligible === false &&
    secretBlocked.secretPolicyMatched === false,
  'secret exposure must fail closed',
)

const auditBlocked =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,

    policy: {
      ...baseInput.policy,
      auditRequired:
        false as true,
    },
  })

negative()

assert(
  auditBlocked.contractEligible === false &&
    auditBlocked.auditRequired === false,
  'missing audit requirement must fail closed',
)


const registryMissingTool = evaluateRuntimeToolControlledExternalReadContract({
  ...baseInput,
  envelope: {
    ...baseInput.envelope,
    toolId: 'tool.not.registered.v287.11',
  },
  boundary: {
    ...baseInput.boundary,
    toolId: 'tool.not.registered.v287.11',
    toolRegistered: true,
    toolAllowed: true,
  },
})

negative()

assert(
  registryMissingTool.contractEligible === false &&
    registryMissingTool.contractStatus === 'blocked',
  'unregistered tool must fail closed even when boundary claims registered/allowed',
)

assert(
  registryMissingTool.networkAccess === false &&
    registryMissingTool.externalReadApplied === false &&
    registryMissingTool.executionApplied === false &&
    registryMissingTool.externalMutation === false &&
    registryMissingTool.mutationApplied === false &&
    registryMissingTool.providerInvocation === false,
  'unregistered tool must preserve all no-effect invariants',
)

const registryBoundaryDivergence =
  evaluateRuntimeToolControlledExternalReadContract({
    ...baseInput,
    boundary: {
      ...baseInput.boundary,
      toolRegistered: true,
      toolAllowed: false,
    },
  })

negative()

assert(
  registryBoundaryDivergence.contractEligible === false &&
    registryBoundaryDivergence.contractStatus === 'blocked',
  'registry/boundary allowlist divergence must fail closed',
)

assert(
  registryBoundaryDivergence.networkAccess === false &&
    registryBoundaryDivergence.externalReadApplied === false &&
    registryBoundaryDivergence.executionApplied === false &&
    registryBoundaryDivergence.externalMutation === false &&
    registryBoundaryDivergence.mutationApplied === false &&
    registryBoundaryDivergence.providerInvocation === false,
  'allowlist divergence must preserve all no-effect invariants',
)

console.log(
  JSON.stringify(
    {
      version:
        'v287.11-governed-controlled-external-read-tool-allowlist-proof',

      positive: {
        contractEligible:
          eligible.contractEligible,

        contractStatus:
          eligible.contractStatus,

        networkAccess:
          eligible.networkAccess,

        externalReadApplied:
          eligible.externalReadApplied,

        executionApplied:
          eligible.executionApplied,

        externalMutation:
          eligible.externalMutation,

        mutationApplied:
          eligible.mutationApplied,

        providerInvocation:
          eligible.providerInvocation,
      },

      negative: {
        hostBlocked:
          !hostBlocked.contractEligible,

        resourceBlocked:
          !resourceBlocked.contractEligible,

        protocolBlocked:
          !protocolBlocked.contractEligible,

        boundaryBlocked:
          !boundaryBlocked.contractEligible,

        identityBlocked:
          !identityBlocked.contractEligible,

        costBlocked:
          !costBlocked.contractEligible,

        secretBlocked:
          !secretBlocked.contractEligible,

        auditBlocked:
          !auditBlocked.contractEligible,
      },

      invariants: {
        contractIsNotAuthorization: true,
        contractIsNotExecution: true,
        externalReadIsNotMutation: true,
        networkAccess: false,
        externalReadApplied: false,
        externalMutation: false,
        providerInvocation: false,
      },

      assertionCount,
      negativeCount,
    },
    null,
    2,
  ),
)
