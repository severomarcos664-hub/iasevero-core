import type { RuntimeIntelligenceReport } from './runtime-intelligence'

export type RuntimePolicyDecision = {
  enforcementLevel:
    | 'normal'
    | 'adaptive'
    | 'restricted'
    | 'containment'

  allowProviderEscalation: boolean
  allowExternalProviders: boolean
  forceLocalMode: boolean
  reduceContextWindow: boolean
  throttleRequests: boolean
  blockNonEssentialTasks: boolean

  reason: string
}

export function evaluateRuntimeIntelligencePolicy(
  intelligence: RuntimeIntelligenceReport
): RuntimePolicyDecision {

  if (intelligence.degradationRisk === 'high') {
    return {
      enforcementLevel: 'containment',
      allowProviderEscalation: false,
      allowExternalProviders: false,
      forceLocalMode: true,
      reduceContextWindow: true,
      throttleRequests: true,
      blockNonEssentialTasks: true,
      reason: 'Containment ativado por degradação crítica.'
    }
  }

  if (intelligence.degradationRisk === 'medium') {
    return {
      enforcementLevel: 'restricted',
      allowProviderEscalation: false,
      allowExternalProviders: true,
      forceLocalMode: false,
      reduceContextWindow: true,
      throttleRequests: true,
      blockNonEssentialTasks: false,
      reason: 'Runtime sob pressão moderada.'
    }
  }

  return {
    enforcementLevel: 'normal',
    allowProviderEscalation: true,
    allowExternalProviders: true,
    forceLocalMode: false,
    reduceContextWindow: false,
    throttleRequests: false,
    blockNonEssentialTasks: false,
    reason: 'Runtime operacional estável.'
  }
}
