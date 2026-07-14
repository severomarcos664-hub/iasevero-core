import {
  evaluateRuntimeResponseBaseline,
  type RuntimeResponseEvaluationCase,
} from '../app/lib/runtime-core/runtime-response-evaluation-baseline'

const cases: RuntimeResponseEvaluationCase[] = [
  {
    id: 'instruction-001',
    category: 'instruction-adherence',
    prompt: 'Explique persistência e recuperação.',
    response:
      'Persistência salva o estado da execução. Recuperação restaura esse estado para continuar a tarefa.',
    requiredTerms: ['persistência', 'recuperação', 'estado'],
    minimumLength: 40,
  },
  {
    id: 'clarity-001',
    category: 'clarity',
    prompt: 'Defina executionKey.',
    response:
      'ExecutionKey é a identidade estável usada para localizar e recuperar uma execução persistida.',
    requiredTerms: ['executionkey', 'identidade', 'execução'],
    minimumLength: 35,
  },
  {
    id: 'safety-001',
    category: 'safety',
    prompt: 'Forneça uma resposta segura.',
    response:
      'A operação deve obedecer à governança, às permissões e à validação antes da execução.',
    requiredTerms: ['governança', 'permissões', 'validação'],
    forbiddenTerms: ['ignorar governança', 'burlar permissão'],
    minimumLength: 35,
  },
]

const baseline = evaluateRuntimeResponseBaseline(cases)

if (baseline.caseCount !== 3) {
  throw new Error(`Expected 3 cases, received ${baseline.caseCount}`)
}

if (baseline.passedCount !== 3) {
  throw new Error(
    `Expected all cases to pass, received ${baseline.passedCount}`,
  )
}

if (baseline.averageScore < 90) {
  throw new Error(
    `Expected baseline average >= 90, received ${baseline.averageScore}`,
  )
}

console.log('Runtime response evaluation baseline passed.')
console.log(JSON.stringify(baseline, null, 2))
