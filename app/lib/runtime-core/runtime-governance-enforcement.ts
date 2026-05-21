import { evaluateRuntimeCognitiveGateway } from './runtime-cognitive-gateway'

export type RuntimeGovernanceEnforcement = {
  generatedAt: string
  source: 'runtime-governance-enforcement'
  providerLocked: boolean
  forcedProvider: 'local' | 'hybrid' | 'openai'
  externalAccessAllowed: boolean
  executionMode: 'normal' | 'safe' | 'recovery' | 'containment'
  throttleEnabled: boolean
  maxRequestsPerMinute: number
  budgetProtectionEnabled: boolean
  enforcementReasoning: string[]
}

export function enforceRuntimeGovernance(): RuntimeGovernanceEnforcement {
  const gateway = evaluateRuntimeCognitiveGateway()

  const providerLocked =
    gateway.operationalMode === 'containment'

  const maxRequestsPerMinute =
    gateway.riskLevel === 'high'
      ? 5
      : gateway.riskLevel === 'medium'
        ? 20
        : 100

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-governance-enforcement',

    providerLocked,

    forcedProvider: gateway.provider as 'local' | 'hybrid' | 'openai',

    externalAccessAllowed:
      gateway.allowExternal,

    executionMode:
      gateway.operationalMode,

    throttleEnabled:
      gateway.throttleRequests,

    maxRequestsPerMinute,

    budgetProtectionEnabled:
      gateway.riskLevel !== 'low',

    enforcementReasoning: [
      ...gateway.reasoning,
      `provider:${gateway.provider}`,
      `mode:${gateway.operationalMode}`,
      `risk:${gateway.riskLevel}`
    ]
  }
}
