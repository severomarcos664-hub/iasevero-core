import {
  prepareRuntimeToolControlledExternalReadInvocation,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-invocation-preparation'

import {
  evaluateRuntimeExecutionBoundAuthority,
} from '../app/lib/runtime-executive-authority-gateway/runtime-execution-bound-authority'

import {
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contextual-admission-authority'

import {
  createRuntimeToolRegistry,
} from '../app/lib/runtime-core/runtime-tool-registry'

const preparation =
  prepareRuntimeToolControlledExternalReadInvocation({
    executionKey: 'exec-v287.52-proof',
    correlationId: 'corr-v287.52-proof',
    traceId: 'trace-v287.52-proof',
    stepId: 'step-v287.52-proof',
    toolId: 'external.read',
    validatedInput: {
      protocol: 'https',
      host: 'example.com',
      resource: '/',
    },
    idempotencyKey: 'external.read:v287.52-proof',
    policy: {
      category: 'execution',
      risk: 'high',
      timeoutMs: 3000,
      retries: 0,
      critical: true,
    },
  })

const executionAuthority =
  evaluateRuntimeExecutionBoundAuthority({
    executionKey: preparation.executionKey,
    executiveAuthority: {
      executionAllowed: true,
    },
  })

const admitted =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority({
    preparation,
    executionAuthority,
    contextualGrant: {
      toolId: 'external.read',
      executionKey: preparation.executionKey,
      admissionAllowed: true,
    },
  })

const deniedGrant =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority({
    preparation,
    executionAuthority,
    contextualGrant: {
      toolId: 'external.read',
      executionKey: preparation.executionKey,
      admissionAllowed: false,
    },
  })

const deniedAuthority =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority({
    preparation,
    executionAuthority:
      evaluateRuntimeExecutionBoundAuthority({
        executionKey: preparation.executionKey,
        executiveAuthority: {
          executionAllowed: false,
        },
      }),
    contextualGrant: {
      toolId: 'external.read',
      executionKey: preparation.executionKey,
      admissionAllowed: true,
    },
  })

const mismatchedGrant =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority({
    preparation,
    executionAuthority,
    contextualGrant: {
      toolId: 'external.read',
      executionKey: 'different-execution',
      admissionAllowed: true,
    },
  })

const mismatchedAuthority =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority({
    preparation,
    executionAuthority:
      evaluateRuntimeExecutionBoundAuthority({
        executionKey: 'different-execution',
        executiveAuthority: {
          executionAllowed: true,
        },
      }),
    contextualGrant: {
      toolId: 'external.read',
      executionKey: preparation.executionKey,
      admissionAllowed: true,
    },
  })

const registryBefore = createRuntimeToolRegistry()
const externalReadBefore =
  registryBefore.tools.find((tool) => tool.id === 'external.read')

const registryAfter = createRuntimeToolRegistry()
const externalReadAfter =
  registryAfter.tools.find((tool) => tool.id === 'external.read')

const registryRemainsFailClosed =
  externalReadBefore?.allowed === false &&
  externalReadAfter?.allowed === false

const effectsRemainFalse =
  admitted.registryMutationApplied === false &&
  admitted.networkAccess === false &&
  admitted.externalReadApplied === false &&
  admitted.executionApplied === false &&
  admitted.mutationApplied === false &&
  admitted.providerInvocation === false

const passed =
  preparation.invocationPreparationValidated === true &&
  executionAuthority.authorityBound === true &&
  admitted.contextualAdmission === true &&
  deniedGrant.contextualAdmission === false &&
  deniedAuthority.contextualAdmission === false &&
  mismatchedGrant.contextualAdmission === false &&
  mismatchedAuthority.contextualAdmission === false &&
  registryRemainsFailClosed &&
  effectsRemainFalse

console.log({
  architecture:
    'governed-controlled-external-read-contextual-admission-authority',

  invocationPrepared:
    preparation.invocationPreparationValidated,

  executionAuthorityBound:
    executionAuthority.authorityBound,

  contextualAdmissionGranted:
    admitted.contextualAdmission,

  deniedGrantRejected:
    deniedGrant.contextualAdmission === false,

  deniedAuthorityRejected:
    deniedAuthority.contextualAdmission === false,

  mismatchedGrantRejected:
    mismatchedGrant.contextualAdmission === false,

  mismatchedAuthorityRejected:
    mismatchedAuthority.contextualAdmission === false,

  registryRemainsFailClosed,

  registryMutationApplied:
    admitted.registryMutationApplied,

  networkAccess:
    admitted.networkAccess,

  externalReadApplied:
    admitted.externalReadApplied,

  executionApplied:
    admitted.executionApplied,

  mutationApplied:
    admitted.mutationApplied,

  providerInvocation:
    admitted.providerInvocation,
})

if (!passed) {
  console.error(
    'Contextual admission authority behavioral proof failed.',
  )
  process.exit(1)
}

console.log(
  'Runtime governed controlled external read contextual admission authority behavioral proof passed.',
)
