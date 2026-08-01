import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = (path: string): string => fs.readFileSync(path, 'utf8')

const route = read('app/api/chat/route.ts')
const decisionGate = read(
  'app/lib/runtime-core/runtime-decision-gate.ts',
)
const kernel = read(
  'app/lib/runtime-core/runtime-cognitive-kernel-integration.ts',
)
const authorityGateway = read(
  'app/lib/runtime-executive-authority-gateway/runtime-executive-authority-gateway.ts',
)
const canonicalFlow = read(
  'docs/architecture/RUNTIME_CANONICAL_EXECUTION_FLOW.md',
)

assert.match(
  route,
  /evaluateRuntimeDecisionGate\(/,
  'The API must call the Runtime Decision Gate.',
)

assert.match(
  decisionGate,
  /runRuntimeCognitiveKernel\(/,
  'The Decision Gate must call the Runtime Cognitive Kernel.',
)

assert.match(
  kernel,
  /evaluateRuntimeExecutiveAuthorityGateway\(/,
  'The Cognitive Kernel must call the Executive Authority Gateway.',
)

assert.match(
  kernel,
  /finalExecutionDecision/,
  'The Cognitive Kernel must produce a final execution decision.',
)

assert.match(
  authorityGateway,
  /executionAllowed/,
  'The Executive Authority Gateway must formalize execution authority.',
)

assert.match(
  canonicalFlow,
  /Subfluxo adaptativo interno/,
  'The canonical document must separate the adaptive internal subflow.',
)

assert.match(
  canonicalFlow,
  /PARTIALLY_PROVED/,
  'The adaptive subflow must not be claimed as fully proved.',
)

assert.match(
  canonicalFlow,
  /executionApplied=false/,
  'The canonical document must preserve executionApplied=false.',
)

assert.match(
  canonicalFlow,
  /mutationApplied=false/,
  'The canonical document must preserve mutationApplied=false.',
)

const adaptiveSubflowClaimedAsLinear =
  /Execution Pipeline\s*\n\s*↓\s*\n\s*Hybrid Decision Evaluator\s*\n\s*↓\s*\n\s*Adaptive Decision Layer\s*\n\s*↓\s*\n\s*Execution Governance Matrix\s*\n\s*↓\s*\n\s*Consensus Engine/.test(
    canonicalFlow,
  )

assert.equal(
  adaptiveSubflowClaimedAsLinear,
  false,
  'The adaptive internal subflow must not be documented as a fully proved linear chain.',
)

const result = {
  apiCallsDecisionGate: true,
  decisionGateCallsKernel: true,
  kernelCallsAuthorityGateway: true,
  kernelProducesFinalExecutionDecision: true,
  authorityGatewayFormalizesAuthority: true,
  adaptiveSubflowFullyProved: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log('Runtime governed authority ownership proof passed.')
console.log(result)
