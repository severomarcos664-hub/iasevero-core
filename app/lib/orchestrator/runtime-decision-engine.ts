import { executeRuntimeConsciousLoop } from './runtime-conscious-loop'
import { resolveHybridProvider } from './hybrid-router'
import { executeSelfHealing } from './self-healing'
import { evaluateRuntimePolicy } from './runtime-policy'
import { evaluateRuntimeGovernance } from './runtime-governor'
import { evaluateExecutionControl } from './runtime-execution-control'
import { enforceRuntimeExecution } from './runtime-enforcement'
import { createRuntimeContext, appendRuntimeTrace, type RuntimeMode, type RuntimeProvider } from './runtime-context'

export function executeRuntimeDecisionEngine() {
  const consciousness = executeRuntimeConsciousLoop()

  const routing = resolveHybridProvider()

  const decisions: string[] = []

  if (!consciousness.consciousness.operational) {
    decisions.push('Ativar modo seguro.')
  }

  if (consciousness.consciousness.healed) {
    decisions.push('Runtime recuperado automaticamente.')
  }

  if (routing.mode === 'safe') {
    decisions.push('Provider local forçado.')
  }

  const healing =
    consciousness.consciousness.operational
      ? {
          healed: false,
          reason: 'Healing não necessário.'
        }
      : executeSelfHealing()

  const stable =
    consciousness.consciousness.operational &&
    routing.mode !== 'safe'

  const mode = (routing.mode === 'openai' || routing.mode === 'hybrid' || routing.mode === 'safe')
    ? routing.mode as RuntimeMode
    : 'local'

  const provider = (routing.provider === 'openai' || routing.provider === 'hybrid')
    ? routing.provider as RuntimeProvider
    : 'local'

  let context = createRuntimeContext({
    mode,
    provider,
    allowExternal: routing.provider !== 'local',
    safeMode: routing.mode === 'safe',
    stable,
    healing: healing.healed,
    reason: routing.reason,
    decisions,
    trace: []
  })



context = appendRuntimeTrace(context, 'runtime-decision-engine:start')
context = appendRuntimeTrace(context, `routing:${routing.mode}`)
context = appendRuntimeTrace(context, `provider:${provider}`)
context = appendRuntimeTrace(context, healing.healed ? 'self-healing:executed' : 'self-healing:skipped')

const policy = evaluateRuntimePolicy(context)

decisions.push(`policy:${policy.severity}:${policy.reason}`)

context = appendRuntimeTrace(
  context,
  `policy:${policy.allowed ? 'allowed' : 'blocked'}:${policy.severity}`
)

const governance = evaluateRuntimeGovernance(context, policy)

decisions.push(`governance:${governance.severity}:${governance.reason}`)

context = appendRuntimeTrace(
  context,
  `governance:${governance.executable ? 'executable' : 'blocked'}:${governance.severity}`
)

const executionControl = evaluateExecutionControl(context)

decisions.push(
  `execution:${executionControl.allowed ? 'allowed' : 'blocked'}:${executionControl.reason}`
)

context = appendRuntimeTrace(
  context,
  `execution:${executionControl.timeoutMs}:${executionControl.maxRetries}`
)

const enforcement = enforceRuntimeExecution(context, governance)

decisions.push(`enforcement:${enforcement.severity}:${enforcement.reason}`)

context = appendRuntimeTrace(
  context,
  `enforcement:${enforcement.allowed ? 'allowed' : 'blocked'}:${enforcement.severity}`
)


  return {
    timestamp: new Date().toISOString(),
    context,
    consciousness,
    routing,
    healing,
    policy,
    governance,
    enforcement,
    executionControl,
    decisions,
    stable
  }
}
