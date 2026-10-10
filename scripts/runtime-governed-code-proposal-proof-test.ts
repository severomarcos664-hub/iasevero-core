import assert from "node:assert/strict"

import {
  createRuntimeGovernedCodeProposal,
  type RuntimeGovernedCodeProposalInput,
} from "../app/lib/runtime-core/runtime-governed-code-proposal"

const valid: RuntimeGovernedCodeProposalInput = {
  missionId: "mission-001",
  proposalId: "proposal-001",
  objective: "Create a controlled test file",
  targetFile: "src/example.ts",
  proposedContent: "export const example = 1",
  modelId: "test-model",
}

const proposal = createRuntimeGovernedCodeProposal(valid)

assert.equal(proposal.schemaVersion, 1)
assert.equal(proposal.missionId, valid.missionId)
assert.equal(proposal.targetFile, valid.targetFile)
assert.equal(proposal.allowedEnvironment, "sandbox-only")
assert.equal(proposal.generatedCodeUntrusted, true)
assert.equal(proposal.proposalPrepared, true)

for (const field of [
  "providerInvocation",
  "sandboxExecutionApplied",
  "executionApplied",
  "mutationApplied",
  "productionMutationApplied",
  "selfPromotionApplied",
] as const) {
  assert.equal(proposal[field], false)
}

for (const targetFile of [
  "/etc/passwd",
  "../escape.ts",
  "src/../escape.ts",
  "src//example.ts",
  "src/./example.ts",
  "src\\\\escape.ts",
]) {
  assert.throws(
    () => createRuntimeGovernedCodeProposal({
      ...valid,
      targetFile,
    }),
    Error
  )
}

for (const field of [
  "missionId",
  "proposalId",
  "objective",
  "targetFile",
  "proposedContent",
  "modelId",
] as const) {
  assert.throws(
    () => createRuntimeGovernedCodeProposal({
      ...valid,
      [field]: " ",
    }),
    Error
  )
}

console.log("VALID_PROPOSAL=PASS")
console.log("NON_EXECUTION_INVARIANTS=PASS")
console.log("UNSAFE_PATH_REJECTION=PASS")
console.log("EMPTY_FIELD_REJECTION=PASS")
console.log("CMD3507_CODE_PROPOSAL_FUNCTIONAL_PROOF=PASS")
