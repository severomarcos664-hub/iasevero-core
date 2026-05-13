import type { RuntimeContext } from './runtime-context'

export type RuntimeTelemetryLevel = 'public' | 'internal'

export type PublicRuntimeTelemetry = {
  stable: boolean
  safeMode: boolean
  timestamp: string
}

export type InternalRuntimeTelemetry = PublicRuntimeTelemetry & {
  requestId: string
  userId: string
  mode: RuntimeContext['mode']
  provider: RuntimeContext['provider']
  allowExternal: boolean
  healing: boolean
  intent: string
  reason: string
  decisions: string[]
  trace: string[]
}

export function toRuntimeTelemetry(
  context: RuntimeContext,
  level: RuntimeTelemetryLevel = 'public'
): PublicRuntimeTelemetry | InternalRuntimeTelemetry {
  const base: PublicRuntimeTelemetry = {
    stable: context.stable,
    safeMode: context.safeMode,
    timestamp: context.timestamp
  }

  if (level === 'public') {
    return base
  }

  return {
    ...base,
    requestId: context.requestId,
    userId: context.userId,
    mode: context.mode,
    provider: context.provider,
    allowExternal: context.allowExternal,
    healing: context.healing,
    intent: context.intent,
    reason: context.reason,
    decisions: context.decisions,
    trace: context.trace
  }
}
