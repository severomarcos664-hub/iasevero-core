export type RuntimeMode = 'local' | 'openai' | 'hybrid' | 'safe'
export type RuntimeProvider = 'local' | 'openai' | 'hybrid'

export type RuntimeContext = {
  requestId: string
  userId: string
  mode: RuntimeMode
  provider: RuntimeProvider
  allowExternal: boolean
  safeMode: boolean
  stable: boolean
  healing: boolean
  intent: string
  reason: string
  timestamp: string
  decisions: string[]
  trace: string[]
  metadata: {
    source: 'runtime-context'
    version: 'v1'
  }
}

export function createRuntimeContext(input?: Partial<RuntimeContext>): RuntimeContext {
  return {
    
requestId:
  input?.requestId ||
  (
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `rtx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  ),

    userId: input?.userId || 'local',
    mode: input?.mode || 'local',
    provider: input?.provider || 'local',
    allowExternal: input?.allowExternal ?? false,
    safeMode: input?.safeMode ?? true,
    stable: input?.stable ?? true,
    healing: input?.healing ?? false,
    intent: input?.intent || 'general',
    reason: input?.reason || 'RuntimeContext inicial seguro.',
    timestamp: input?.timestamp || new Date().toISOString(),
    decisions: input?.decisions || [],
    trace: input?.trace || [],
    metadata: {
      source: 'runtime-context',
      version: 'v1'
    }
  }
}

const MAX_TRACE = 200

export function appendRuntimeTrace(
  context: RuntimeContext,
  entry: string
): RuntimeContext {
  const nextTrace = [...context.trace, entry]

  return {
    ...context,
    trace:
      nextTrace.length > MAX_TRACE
        ? nextTrace.slice(nextTrace.length - MAX_TRACE)
        : nextTrace
  }
}

let lastRuntimeState: RuntimeContext | null = null

export function setLastRuntimeState(
  context: RuntimeContext
): RuntimeContext {
  lastRuntimeState = context
  return context
}

export function getLastRuntimeState(): RuntimeContext | null {
  return lastRuntimeState
}
