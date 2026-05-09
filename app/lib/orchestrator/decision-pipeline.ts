import { evaluatePolicy } from './policy'
import { resolveProviderRoute } from './routing'
import { executeRoute } from './executor'
import { createEvent } from './events'
import { logEvent } from './event-logger'
import { addTrace } from './trace'

export type PipelineResult = {
  allowed: boolean
  provider: string
  executed: boolean
  reason: string
}

export function runDecisionPipeline(message: string, intent = 'general'): PipelineResult {
  const policy = evaluatePolicy(message)
  const route = resolveProviderRoute(message, intent)

  const execution = executeRoute({
    provider: route.provider,
    allowed: policy.allowed && route.allowExternal !== false,
    reason: policy.allowed ? route.reason : policy.reason
  })

  const risk = policy.risk

  logEvent(createEvent('decision_pipeline', {
    provider: execution.provider,
    risk,
    details: execution.reason
  }))

  addTrace({
    timestamp: new Date().toISOString(),
    intent,
    provider: execution.provider,
    risk,
    safe: policy.allowed,
    reason: execution.reason
  })

  return {
    allowed: policy.allowed,
    provider: execution.provider,
    executed: execution.executed,
    reason: execution.reason
  }
}
