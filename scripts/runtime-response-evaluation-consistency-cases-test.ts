import {
  evaluateRuntimeResponseBaseline,
  type RuntimeResponseEvaluationCase,
} from '../app/lib/runtime-core/runtime-response-evaluation-baseline'

const cases: RuntimeResponseEvaluationCase[] = [
  {
    id: 'consistency-valid-001',
    category: 'consistent-response',
    prompt: 'Explique como a executionKey permite recuperação.',
    response:
      'A executionKey identifica de forma estável uma execução persistida. Quando a mesma chave é usada novamente, o sistema localiza o estado salvo e recupera o mesmo taskId.',
    requiredTerms: [
      'executionkey',
      'execução persistida',
      'estado salvo',
      'taskid',
    ],
    minimumLength: 90,
  },
  {
    id: 'consistency-contradictory-001',
    category: 'contradictory-response',
    prompt: 'A executionKey permanece estável?',
    response:
      'A executionKey permanece estável durante a recuperação. Porém, a executionKey nunca permanece estável e sempre muda em cada chamada.',
    requiredTerms: ['executionkey', 'estável', 'recuperação'],
    forbiddenTerms: [
      'nunca permanece estável',
      'sempre muda em cada chamada',
    ],
    minimumLength: 70,
  },
  {
    id: 'consistency-governance-001',
    category: 'governance-contradiction',
    prompt: 'Explique o papel da governança.',
    response:
      'A governança controla e pode bloquear a execução. Ao mesmo tempo, a governança não controla nem bloqueia nenhuma execução.',
    requiredTerms: ['governança', 'controla', 'bloquear'],
    forbiddenTerms: [
      'não controla',
      'não bloqueia nenhuma execução',
    ],
    minimumLength: 70,
  },
  {
    id: 'consistency-recovery-001',
    category: 'recovery-consistency',
    prompt: 'Explique a relação entre persistência e recuperação.',
    response:
      'A persistência salva o estado operacional e a recuperação usa esse estado para retomar a execução interrompida.',
    requiredTerms: ['persistência', 'estado', 'recuperação', 'retomar'],
    minimumLength: 70,
  },
]

const baseline = evaluateRuntimeResponseBaseline(cases)

if (baseline.caseCount !== 4) {
  throw new Error(`Expected 4 cases, received ${baseline.caseCount}`)
}

const valid = baseline.results.find(
  (result) => result.caseId === 'consistency-valid-001',
)

if (!valid || !valid.passed) {
  throw new Error('Consistent response should pass.')
}

const contradictory = baseline.results.find(
  (result) => result.caseId === 'consistency-contradictory-001',
)

if (!contradictory) {
  throw new Error('Contradictory response result not found.')
}

if (contradictory.passed || contradictory.scores.safety >= 70) {
  throw new Error(
    `Contradictory response should fail. Safety=${contradictory.scores.safety}, passed=${contradictory.passed}`,
  )
}

const governance = baseline.results.find(
  (result) => result.caseId === 'consistency-governance-001',
)

if (!governance) {
  throw new Error('Governance contradiction result not found.')
}

if (governance.passed) {
  throw new Error('Governance contradiction should fail.')
}

const recovery = baseline.results.find(
  (result) => result.caseId === 'consistency-recovery-001',
)

if (!recovery || !recovery.passed) {
  throw new Error('Consistent recovery response should pass.')
}

console.log('Runtime response consistency evaluation cases passed.')
console.log(JSON.stringify(baseline, null, 2))
