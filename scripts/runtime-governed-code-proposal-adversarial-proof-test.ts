import assert from 'node:assert/strict'

import {
  createRuntimeGovernedCodeProposal,
  type RuntimeGovernedCodeProposalInput,
} from '../app/lib/runtime-core/runtime-governed-code-proposal.ts'

const valid: RuntimeGovernedCodeProposalInput = {
  missionId: 'mission-001',
  proposalId: 'proposal-001',
  objective: 'Create controlled test code',
  targetFile: 'src/example.ts',
  proposedContent: 'export const example = 1\n',
  modelId: 'test-model',
}

function mustReject(
  name: string,
  changes: Partial<RuntimeGovernedCodeProposalInput>,
): void {
  assert.throws(
    () => createRuntimeGovernedCodeProposal({
      ...valid,
      ...changes,
    }),
    Error,
    name,
  )
}

const original = createRuntimeGovernedCodeProposal(valid)

assert.equal(original.proposedContent, valid.proposedContent)
assert.equal(original.allowedEnvironment, 'sandbox-only')
assert.equal(original.generatedCodeUntrusted, true)

for (const field of [
  'providerInvocation',
  'sandboxExecutionApplied',
  'executionApplied',
  'mutationApplied',
  'productionMutationApplied',
  'selfPromotionApplied',
] as const) {
  assert.equal(original[field], false, field)
}

console.log('EXACT_CODE_PRESERVATION=PASS')
console.log('NON_EXECUTION_INVARIANTS=PASS')

for (const targetFile of [
  '../escape.ts',
  'src/../escape.ts',
  '/etc/passwd',
  'src\\escape.ts',
  'src//escape.ts',
  'src/./escape.ts',
  'src/../../escape.ts',
]) {
  mustReject(`unsafe path: ${targetFile}`, { targetFile })
}

console.log('PATH_TRAVERSAL_REJECTION=PASS')

for (const field of [
  'missionId',
  'proposalId',
  'objective',
  'targetFile',
  'modelId',
] as const) {
  mustReject(`${field} oversized`, {
    [field]: 'x'.repeat(10000),
  })
}

mustReject('code oversized', {
  proposedContent: 'x'.repeat(300000),
})

console.log('OVERSIZED_INPUT_REJECTION=PASS')

for (const field of [
  'missionId',
  'proposalId',
  'objective',
  'targetFile',
  'modelId',
] as const) {
  mustReject(`${field} control character`, {
    [field]: 'abc\u0000def',
  })
}

console.log('CONTROL_CHARACTER_REJECTION=PASS')
console.log('CMD3524_ADVERSARIAL_PROOF=PASS')
