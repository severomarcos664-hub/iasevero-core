import { runDiagnostics } from './diagnostics'
import { enforceRuntimeSafety } from './runtime-guardian'
import { resolveHybridProvider } from './hybrid-router'
import { getRuntimeAwareness } from './awareness-engine'

export function superviseRuntime() {
  const diagnostics = runDiagnostics()

  const protection = enforceRuntimeSafety()

  const routing = resolveHybridProvider()

  const awareness = getRuntimeAwareness()

  return {
    timestamp: new Date().toISOString(),
    diagnostics,
    protection,
    routing,
    awareness,
    operational:
      diagnostics.healthy &&
      awareness.awareness.safe
  }
}
