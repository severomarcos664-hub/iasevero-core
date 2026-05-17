export type RuntimeTaskStep = {
  id: string
  title: string
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
}

export type RuntimeTaskPlan = {
  objective: string
  createdAt: string
  steps: RuntimeTaskStep[]
}

export function createRuntimeTaskPlan(
  objective: string
): RuntimeTaskPlan {

  const normalized = objective.toLowerCase()

  const steps: RuntimeTaskStep[] = []

  if (
    normalized.includes('build') ||
    normalized.includes('runtime')
  ) {

    steps.push(
      {
        id: 'analyze-runtime',
        title: 'Analisar runtime atual',
        status: 'pending'
      },
      {
        id: 'validate-regression',
        title: 'Executar regressão',
        status: 'pending'
      },
      {
        id: 'rebuild-system',
        title: 'Executar novo build',
        status: 'pending'
      }
    )
  }

  if (
    normalized.includes('security') ||
    normalized.includes('segurança')
  ) {

    steps.push(
      {
        id: 'scan-security',
        title: 'Executar análise de segurança',
        status: 'pending'
      },
      {
        id: 'validate-policies',
        title: 'Validar políticas runtime',
        status: 'pending'
      }
    )
  }

  if (steps.length === 0) {
    steps.push({
      id: 'generic-analysis',
      title: 'Executar análise operacional',
      status: 'pending'
    })
  }

  return {
    objective,
    createdAt: new Date().toISOString(),
    steps
  }
}
