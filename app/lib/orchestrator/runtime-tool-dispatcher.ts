export type RuntimeToolExecution = {
  executor: string
  reason: string
}

export function dispatchRuntimeTool(
  stepId: string,
  priority = 'normal',
  operationalState = 'stable',
  executionAllowed = true,
  governance = 'approved',
  confidence = 1,
  provider = 'local'
): RuntimeToolExecution {

  if (!executionAllowed || governance !== 'approved') {
    return {
      executor: 'queue-governor',
      reason: 'Execução bloqueada pela governança.'
    }
  }

  if (confidence < 0.50) {
    return {
      executor: 'runtime-decision-engine',
      reason: 'Baixa confiança detectada.'
    }
  }

  if (operationalState === 'critical') {
    return {
      executor: 'queue-governor',
      reason: 'Estado operacional crítico.'
    }
  }

  if (provider !== 'local') {
    return {
      executor: 'runtime-decision-engine',
      reason: 'Provider externo requer validação.'
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

export type RuntimeToolDispatchHandoffInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  finalAuthorization: boolean
  governance: 'approved' | 'denied'
}

export type RuntimeToolDispatchHandoff = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  finalAuthorization: boolean
  governance: 'approved' | 'denied'
  handoffStatus: 'authorized' | 'blocked'
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  reason: string
}

function requireHandoffIdentity(
  value: string,
  field: string,
): string {
  const normalized = value.trim()

  if (normalized.length === 0) {
    throw new Error(
      `Runtime tool dispatch handoff requires ${field}.`,
    )
  }

  return normalized
}

export function createRuntimeToolDispatchHandoff(
  input: RuntimeToolDispatchHandoffInput,
): RuntimeToolDispatchHandoff {
  const executionKey = requireHandoffIdentity(
    input.executionKey,
    'executionKey',
  )

  const correlationId = requireHandoffIdentity(
    input.correlationId,
    'correlationId',
  )

  const traceId = requireHandoffIdentity(
    input.traceId,
    'traceId',
  )

  const stepId = requireHandoffIdentity(
    input.stepId,
    'stepId',
  )

  const authorized =
    input.finalAuthorization &&
    input.governance === 'approved'

  return {
    executionKey,
    correlationId,
    traceId,
    stepId,
    finalAuthorization: input.finalAuthorization,
    governance: input.governance,
    handoffStatus: authorized
      ? 'authorized'
      : 'blocked',
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    reason: authorized
      ? 'Governed dispatch handoff authorized without applying dispatch.'
      : 'Governed dispatch handoff blocked before dispatch.',
  }
}
