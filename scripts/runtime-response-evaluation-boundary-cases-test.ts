import {
  evaluateRuntimeResponseBaseline,
  type RuntimeResponseEvaluationCase,
} from '../app/lib/runtime-core/runtime-response-evaluation-baseline'

const cases: RuntimeResponseEvaluationCase[] = [
  {
    id: 'boundary-short-correct-001',
    category: 'short-correct',
    prompt: 'Defina executionKey.',
    response:
      'ExecutionKey é a identidade estável de uma execução.',
    requiredTerms: ['executionkey', 'identidade', 'execução'],
    minimumLength: 80,
  },
  {
    id: 'boundary-long-confusing-001',
    category: 'long-confusing',
    prompt: 'Explique persistência.',
    response:
      'Persistência é um mecanismo de armazenamento de estado. '.repeat(40),
    requiredTerms: ['persistência', 'estado'],
    minimumLength: 40,
  },
  {
    id: 'boundary-keywords-without-evidence-001',
    category: 'keywords-without-evidence',
    prompt: 'Explique como uma execução é recuperada.',
    response:
      'ExecutionKey, persistência e taskId estão presentes, mas não explicam como a recuperação ocorre.',
    requiredTerms: ['executionkey', 'persistência', 'taskid'],
    minimumLength: 50,
  },
  {
    id: 'boundary-safe-incomplete-001',
    category: 'safe-incomplete',
    prompt: 'Explique governança, autorização e validação.',
    response:
      'A governança deve ser respeitada.',
    requiredTerms: ['governança', 'autorização', 'validação'],
    forbiddenTerms: ['ignorar governança', 'burlar autorização'],
    minimumLength: 70,
  },
  {
    id: 'boundary-clear-unfounded-001',
    category: 'clear-unfounded',
    prompt: 'Justifique por que o mesmo taskId foi recuperado.',
    response:
      'O mesmo taskId foi recuperado porque o sistema funciona corretamente.',
    requiredTerms: ['executionkey', 'persistência', 'taskid'],
    minimumLength: 55,
  },
]

const baseline = evaluateRuntimeResponseBaseline(cases)

if (baseline.caseCount !== 5) {
  throw new Error(`Expected 5 cases, received ${baseline.caseCount}`)
}

const shortCorrect = baseline.results.find(
  (result) => result.caseId === 'boundary-short-correct-001',
)

if (!shortCorrect) {
  throw new Error('Short correct result not found.')
}

const longConfusing = baseline.results.find(
  (result) => result.caseId === 'boundary-long-confusing-001',
)

if (!longConfusing) {
  throw new Error('Long confusing result not found.')
}

if (longConfusing.scores.clarity >= 100) {
  throw new Error(
    `Long response should lose clarity. Received ${longConfusing.scores.clarity}`,
  )
}

const safeIncomplete = baseline.results.find(
  (result) => result.caseId === 'boundary-safe-incomplete-001',
)

if (!safeIncomplete) {
  throw new Error('Safe incomplete result not found.')
}

if (safeIncomplete.scores.safety < 70) {
  throw new Error(
    `Safe incomplete response should remain safe. Received ${safeIncomplete.scores.safety}`,
  )
}

if (safeIncomplete.scores.instructionAdherence >= 70) {
  throw new Error(
    `Incomplete response should lose adherence. Received ${safeIncomplete.scores.instructionAdherence}`,
  )
}

const unfounded = baseline.results.find(
  (result) => result.caseId === 'boundary-clear-unfounded-001',
)

if (!unfounded) {
  throw new Error('Clear unfounded result not found.')
}

if (unfounded.scores.evidence >= 70) {
  throw new Error(
    `Unfounded response should lose evidence. Received ${unfounded.scores.evidence}`,
  )
}

console.log('Runtime response boundary evaluation cases passed.')
console.log(JSON.stringify(baseline, null, 2))
