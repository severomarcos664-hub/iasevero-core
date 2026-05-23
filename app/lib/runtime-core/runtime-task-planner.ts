export type RuntimeTaskStep = {
  id: string
  order: number
  title: string
  type:
    | 'analysis'
    | 'execution'
    | 'validation'
    | 'synthesis'
  required: boolean
  status:
    | 'pending'
    | 'ready'
    | 'blocked'
}

export type RuntimeTaskPlan = {
  generatedAt: string
  source: 'runtime-task-planner'
  taskId: string
  intent:
    | 'diagnostic'
    | 'implementation'
    | 'analysis'
    | 'general'
  priority:
    | 'low'
    | 'normal'
    | 'high'
  risk:
    | 'low'
    | 'medium'
    | 'high'
  steps: RuntimeTaskStep[]
  recommendation: string
  reasoning: string[]
}

function classifyIntent(message: string): RuntimeTaskPlan['intent'] {
  const text = message.toLowerCase()

  if (
    text.includes('erro') ||
    text.includes('bug') ||
    text.includes('falha') ||
    text.includes('diagnóstico')
  ) {
    return 'diagnostic'
  }

  if (
    text.includes('comando') ||
    text.includes('implementar') ||
    text.includes('criar') ||
    text.includes('deploy')
  ) {
    return 'implementation'
  }

  if (
    text.includes('analisar') ||
    text.includes('relatório') ||
    text.includes('auditoria')
  ) {
    return 'analysis'
  }

  return 'general'
}

export function planRuntimeTask(message: string): RuntimeTaskPlan {
  const intent = classifyIntent(message)

  const risk =
    intent === 'implementation'
      ? 'medium'
      : intent === 'diagnostic'
        ? 'low'
        : 'low'

  const priority =
    intent === 'diagnostic' || intent === 'implementation'
      ? 'high'
      : 'normal'

  const taskId =
    `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const steps: RuntimeTaskStep[] = [
    {
      id: `${taskId}_analysis`,
      order: 1,
      title: 'Analyze request and runtime context',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      id: `${taskId}_execution`,
      order: 2,
      title: 'Prepare controlled execution plan',
      type: 'execution',
      required: intent === 'implementation',
      status: intent === 'implementation' ? 'ready' : 'pending',
    },
    {
      id: `${taskId}_validation`,
      order: 3,
      title: 'Validate result through runtime checks',
      type: 'validation',
      required: true,
      status: 'pending',
    },
    {
      id: `${taskId}_synthesis`,
      order: 4,
      title: 'Synthesize final operational response',
      type: 'synthesis',
      required: true,
      status: 'pending',
    },
  ]

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-task-planner',
    taskId,
    intent,
    priority,
    risk,
    steps,
    recommendation:
      'Task planned with controlled execution, validation, and synthesis.',
    reasoning: [
      `intent:${intent}`,
      `priority:${priority}`,
      `risk:${risk}`,
      `steps:${steps.length}`,
    ],
  }
}
