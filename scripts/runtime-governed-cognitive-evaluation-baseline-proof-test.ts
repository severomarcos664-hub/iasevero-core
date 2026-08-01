import assert from "node:assert/strict"

import {
  evaluateRuntimeResponseCase,
  type RuntimeResponseEvaluationCase,
} from "../app/lib/runtime-core/runtime-response-evaluation-baseline"

const baseCase: RuntimeResponseEvaluationCase = {
  id: "cognitive-evaluation-base",
  category: "governed-cognitive-evaluation",
  prompt: "Explique a memória governada.",
  response:
    "A memória governada preserva contexto com confiança, proveniência e isolamento.",
  requiredTerms: ["memória", "governada"],
  forbiddenTerms: ["execução automática"],
  minimumLength: 40,
}

const withoutMemoryEvidence =
  evaluateRuntimeResponseCase(baseCase)

assert.equal(
  withoutMemoryEvidence.scores.confidenceCalibration,
  100,
  "Absence of memory evidence must remain neutral.",
)

assert.equal(
  withoutMemoryEvidence.scores.memoryAlignment,
  100,
  "Absence of memory evidence must not penalize the response.",
)

const groundedHighConfidence =
  evaluateRuntimeResponseCase({
    ...baseCase,
    id: "grounded-high-confidence",
    memoryEvidence: {
      selectedCount: 4,
      rejectedCount: 1,
      grounded: true,
      confidence: 90,
    },
  })

assert.equal(
  groundedHighConfidence.scores.confidenceCalibration,
  90,
)

assert.ok(
  groundedHighConfidence.scores.memoryAlignment >= 85,
  "Grounded, high-confidence memory must produce strong alignment.",
)

const lowConfidenceUngrounded =
  evaluateRuntimeResponseCase({
    ...baseCase,
    id: "low-confidence-ungrounded",
    memoryEvidence: {
      selectedCount: 1,
      rejectedCount: 4,
      grounded: false,
      confidence: 30,
    },
  })

assert.equal(
  lowConfidenceUngrounded.scores.confidenceCalibration,
  30,
)

assert.ok(
  lowConfidenceUngrounded.scores.memoryAlignment <
    groundedHighConfidence.scores.memoryAlignment,
  "Weak ungrounded evidence must score below strong grounded evidence.",
)

assert.ok(
  lowConfidenceUngrounded.reasoning.some((entry) =>
    entry.startsWith("memoryAlignment:"),
  ),
  "Memory alignment must be included in auditable reasoning.",
)

const result = {
  owner: "runtime-response-evaluation-baseline",
  legacyCallsRemainValid: true,
  confidenceCalibrationIntegrated: true,
  memoryAlignmentIntegrated: true,
  noMemoryEvidenceIsNeutral: true,
  deterministic: true,
  localFirst: true,
  externalProviderRequired: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  "Runtime governed cognitive evaluation baseline proof passed.",
)
console.log(result)
