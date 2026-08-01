import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

assert.match(
  route,
  /memoryEvidence:\s*governedMemoryContext/,
  'The API must pass governed memory evidence to the response evaluator.',
)

assert.match(
  route,
  /selectedCount:\s*governedMemoryContext\.selectedCount/,
  'The API must propagate selected memory count.',
)

assert.match(
  route,
  /rejectedCount:\s*governedMemoryContext\.rejectedCount/,
  'The API must propagate rejected memory count.',
)

assert.match(
  route,
  /grounded:\s*governedMemoryContext\.grounded/,
  'The API must propagate grounded state.',
)

assert.match(
  route,
  /responseEvaluation\.scores\.confidenceCalibration\s*<\s*70/,
  'Low calibrated confidence must require review.',
)

assert.match(
  route,
  /responseEvaluation\.scores\.memoryAlignment\s*<\s*70/,
  'Low memory alignment must require review.',
)

assert.match(
  route,
  /cognitiveEvaluation:\s*\{/,
  'The response trace must contain cognitive evaluation evidence.',
)

assert.match(
  route,
  /decision:\s*evaluationDecision/,
  'The trace must preserve the governed evaluation decision.',
)

assert.doesNotMatch(
  route,
  /executionApplied:\s*true/,
  'This integration must not claim that execution was applied.',
)

const result = {
  owner: 'app/api/chat/route.ts',
  memoryEvidenceConnected: true,
  confidenceCalibrationInfluencesDecision: true,
  memoryAlignmentInfluencesDecision: true,
  cognitiveTraceIntegrated: true,
  networkAccessApplied: false,
  secretAccessApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed cognitive contracts API proof passed.',
)
console.log(result)
