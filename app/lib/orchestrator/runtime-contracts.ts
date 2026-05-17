export type RuntimeContractStatus =
  | 'valid'
  | 'invalid'

export type RuntimeContractValidation = {
  contract: string
  status: RuntimeContractStatus
  reason: string
}

export type RuntimeExecutionContract = {
  requestId: string
  userId: string
  mode: 'local' | 'openai' | 'hybrid'
  provider: string
  timestamp: string
}

export type RuntimeMemoryContract = {
  memoryMode: string
  memoryEnabled: boolean
  memoryPressure: number
}

export type RuntimeAwarenessContract = {
  stable: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  healthScore: number
}

export type RuntimeRecoveryContract = {
  recoveryMode: boolean
  cooldownMultiplier: number
  reason: string
}

export type RuntimePolicyContract = {
  enforcementLevel: string
  allowExternalProviders: boolean
  throttleRequests: boolean
}

export type RuntimeTelemetryContract = {
  latencyMs: number
  provider: string
  mode: string
  timestamp: string
}

export function validateExecutionContract(
  contract: RuntimeExecutionContract
): RuntimeContractValidation {
  if (!contract.requestId) {
    return {
      contract: 'execution',
      status: 'invalid',
      reason: 'requestId ausente.'
    }
  }

  if (!contract.userId) {
    return {
      contract: 'execution',
      status: 'invalid',
      reason: 'userId ausente.'
    }
  }

  return {
    contract: 'execution',
    status: 'valid',
    reason: 'Contrato válido.'
  }
}

export function validateAwarenessContract(
  contract: RuntimeAwarenessContract
): RuntimeContractValidation {
  if (contract.healthScore < 0) {
    return {
      contract: 'awareness',
      status: 'invalid',
      reason: 'healthScore inválido.'
    }
  }

  return {
    contract: 'awareness',
    status: 'valid',
    reason: 'Contrato válido.'
  }
}

export function validateTelemetryContract(
  contract: RuntimeTelemetryContract
): RuntimeContractValidation {
  if (contract.latencyMs < 0) {
    return {
      contract: 'telemetry',
      status: 'invalid',
      reason: 'latência inválida.'
    }
  }

  return {
    contract: 'telemetry',
    status: 'valid',
    reason: 'Contrato válido.'
  }
}
