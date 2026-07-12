import { evaluateRuntimeDecisionGate } from '../app/lib/runtime-core/runtime-decision-gate'

function assertCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

const decisionGate = evaluateRuntimeDecisionGate(
  'Validate canonical cognitive response contract',
  'runtime-cognitive-response-contract-test',
)

const cognitiveKernel = decisionGate.kernel

const cognitive = {
  kernelId: cognitiveKernel.kernelId,
  correlationId: decisionGate.correlationId,
  allowed: decisionGate.allowed,
  reason: decisionGate.reason,
  executionAllowed: cognitiveKernel.executionAllowed,
  stopReason: cognitiveKernel.stopReason,
  stages: {
    memory: Boolean(cognitiveKernel.stages.memory),
    planning: Boolean(cognitiveKernel.stages.planning),
    authority: Boolean(cognitiveKernel.stages.authority),
    execution: Boolean(cognitiveKernel.stages.execution),
    reflection: Boolean(cognitiveKernel.stages.reflection),
    consolidation: Boolean(cognitiveKernel.stages.consolidation),
  },
}

assertCondition(
  typeof cognitive.kernelId === 'string' && cognitive.kernelId.length > 0,
  'kernelId must be a non-empty string',
)

assertCondition(
  typeof cognitive.correlationId === 'string' &&
    cognitive.correlationId.length > 0,
  'correlationId must be a non-empty string',
)

assertCondition(
  typeof cognitive.allowed === 'boolean',
  'allowed must be boolean',
)

assertCondition(
  typeof cognitive.reason === 'string' && cognitive.reason.length > 0,
  'reason must be a non-empty string',
)

assertCondition(
  typeof cognitive.executionAllowed === 'boolean',
  'executionAllowed must be boolean',
)

assertCondition(
  cognitive.stopReason === 'completed' ||
    cognitive.stopReason === 'blocked-by-authority',
  'stopReason must be canonical',
)

for (const [stage, completed] of Object.entries(cognitive.stages)) {
  assertCondition(
    typeof completed === 'boolean',
    `stage ${stage} must be boolean`,
  )
}

assertCondition(
  cognitive.stages.memory,
  'memory stage must be available',
)

assertCondition(
  cognitive.stages.planning,
  'planning stage must be available',
)

assertCondition(
  cognitive.stages.authority,
  'authority stage must be available',
)

assertCondition(
  cognitive.stages.reflection,
  'reflection stage must be available',
)

assertCondition(
  cognitive.stages.consolidation,
  'consolidation stage must be available',
)

assertCondition(
  cognitive.allowed === cognitive.executionAllowed,
  'Decision Gate and Cognitive Kernel authorization must agree',
)

if (cognitive.allowed) {
  assertCondition(
    cognitive.stages.execution,
    'execution stage must exist when execution is allowed',
  )
} else {
  assertCondition(
    !cognitive.stages.execution,
    'execution stage must be absent when execution is blocked',
  )
}

console.log(
  'OK: canonical cognitive response contract validated successfully.',
)

console.log(JSON.stringify(cognitive, null, 2))
