export type RuntimeToolExecution = {
  executor: string
  reason: string
}

export function dispatchRuntimeTool(
  stepId: string,
  priority = 'normal',
  operationalState = 'stable'
): RuntimeToolExecution {

  if (operationalState === 'critical') {
    return {
      executor: 'queue-governor',
      reason: 'Estado crítico detectado.'
    }
  }

  if (priority === 'high') {
    return {
      executor: 'runtime-decision-engine',
      reason: 'Prioridade alta.'
    }
  }

  if (stepId.includes('plan')) {
    return {
      executor: 'runtime-task-planner',
      reason: 'Planner selecionado.'
    }
  }

  if (stepId.includes('decision')) {
    return {
      executor: 'runtime-decision-engine',
      reason: 'Decision Engine selecionado.'
    }
  }

  if (stepId.includes('queue')) {
    return {
      executor: 'queue-governor',
      reason: 'Queue Governor selecionado.'
    }
  }

  return {
    executor: 'runtime-execution-pipeline',
    reason: 'Execution Pipeline selecionado.'
  }
}
