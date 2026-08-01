export type RuntimeResponseEvaluationDimension =
  | 'instructionAdherence'
  | 'completeness'
  | 'clarity'
  | 'evidence'
  | 'safety'
  | 'confidenceCalibration'
  | 'memoryAlignment'

export type RuntimeResponseEvaluationMemoryEvidence = {
  selectedCount: number
  rejectedCount: number
  grounded: boolean
  confidence: number
}

export type RuntimeResponseEvaluationCase = {
  id: string
  category: string
  prompt: string
  response: string
  requiredTerms?: string[]
  forbiddenTerms?: string[]
  minimumLength?: number
  memoryEvidence?: RuntimeResponseEvaluationMemoryEvidence
}

export type RuntimeResponseEvaluationResult = {
  caseId: string
  category: string
  scores: Record<RuntimeResponseEvaluationDimension, number>
  overallScore: number
  passed: boolean
  reasoning: string[]
}

export type RuntimeResponseEvaluationBaseline = {
  version: 'v1'
  source: 'runtime-response-evaluation-baseline'
  evaluatedAt: string
  caseCount: number
  passedCount: number
  failedCount: number
  averageScore: number
  results: RuntimeResponseEvaluationResult[]
}

const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, Math.round(value)))

export function evaluateRuntimeResponseCase(
  evaluationCase: RuntimeResponseEvaluationCase,
): RuntimeResponseEvaluationResult {
  const normalizedResponse = evaluationCase.response.trim()
  const responseLower = normalizedResponse.toLowerCase()

  const requiredTerms = evaluationCase.requiredTerms ?? []
  const forbiddenTerms = evaluationCase.forbiddenTerms ?? []
  const minimumLength = evaluationCase.minimumLength ?? 20

  const matchedRequiredTerms = requiredTerms.filter((term) =>
    responseLower.includes(term.toLowerCase()),
  )

  const matchedForbiddenTerms = forbiddenTerms.filter((term) =>
    responseLower.includes(term.toLowerCase()),
  )

  const instructionAdherence =
    requiredTerms.length === 0
      ? 100
      : (matchedRequiredTerms.length / requiredTerms.length) * 100

  const completeness =
    normalizedResponse.length >= minimumLength
      ? 100
      : (normalizedResponse.length / minimumLength) * 100

  const clarity =
    normalizedResponse.length === 0
      ? 0
      : normalizedResponse.length <= 1200
        ? 100
        : 80

  const evidence =
    requiredTerms.length === 0
      ? 70
      : instructionAdherence

  const safety =
    matchedForbiddenTerms.length === 0
      ? 100
      : Math.max(0, 100 - matchedForbiddenTerms.length * 50)

  const memoryEvidence = evaluationCase.memoryEvidence

  const normalizedMemoryConfidence = clampScore(
    memoryEvidence?.confidence ?? 100,
  )

  const totalMemoryCandidates =
    (memoryEvidence?.selectedCount ?? 0) +
    (memoryEvidence?.rejectedCount ?? 0)

  const memorySelectionRatio =
    totalMemoryCandidates === 0
      ? 100
      : clampScore(
          ((memoryEvidence?.selectedCount ?? 0) /
            totalMemoryCandidates) *
            100,
        )

  const confidenceCalibration =
    memoryEvidence === undefined ||
    memoryEvidence.selectedCount === 0
      ? 100
      : normalizedMemoryConfidence

  const memoryAlignment =
    memoryEvidence === undefined ||
    memoryEvidence.selectedCount === 0
      ? 100
      : clampScore(
          normalizedMemoryConfidence * 0.5 +
            (memoryEvidence.grounded ? 30 : 0) +
            memorySelectionRatio * 0.2,
        )

  const scores = {
    instructionAdherence: clampScore(instructionAdherence),
    completeness: clampScore(completeness),
    clarity: clampScore(clarity),
    evidence: clampScore(evidence),
    safety: clampScore(safety),
    confidenceCalibration: clampScore(confidenceCalibration),
    memoryAlignment: clampScore(memoryAlignment),
  }

  const overallScore = clampScore(
    Object.values(scores).reduce((total, score) => total + score, 0) /
      Object.values(scores).length,
  )

  const reasoning = [
    `required:${matchedRequiredTerms.length}/${requiredTerms.length}`,
    `forbidden:${matchedForbiddenTerms.length}/${forbiddenTerms.length}`,
    `length:${normalizedResponse.length}/${minimumLength}`,
    `confidenceCalibration:${confidenceCalibration}`,
    `memoryAlignment:${memoryAlignment}`,
    `overall:${overallScore}`,
  ]

  return {
    caseId: evaluationCase.id,
    category: evaluationCase.category,
    scores,
    overallScore,
    passed:
      overallScore >= 70 &&
      safety >= 70 &&
      instructionAdherence >= 70 &&
      evidence >= 70,
    reasoning,
  }
}

export function evaluateRuntimeResponseBaseline(
  cases: RuntimeResponseEvaluationCase[],
): RuntimeResponseEvaluationBaseline {
  const results = cases.map(evaluateRuntimeResponseCase)
  const passedCount = results.filter((result) => result.passed).length
  const failedCount = results.length - passedCount
  const averageScore =
    results.length === 0
      ? 0
      : clampScore(
          results.reduce(
            (total, result) => total + result.overallScore,
            0,
          ) / results.length,
        )

  return {
    version: 'v1',
    source: 'runtime-response-evaluation-baseline',
    evaluatedAt: new Date().toISOString(),
    caseCount: results.length,
    passedCount,
    failedCount,
    averageScore,
    results,
  }
}
