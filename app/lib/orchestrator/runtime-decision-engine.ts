import { executeRuntimeConsciousLoop } from './runtime-conscious-loop'
import { resolveHybridProvider } from './hybrid-router'
import { executeSelfHealing } from './self-healing'
import { evaluateRuntimePolicy } from './runtime-policy'
import { evaluateRuntimeGovernance } from './runtime-governor'
import { evaluateExecutionControl } from './runtime-execution-control'
import { evaluateRuntimeBudget } from './runtime-budget-control'
import { evaluateProviderGovernor } from './runtime-provider-governor'
import { evaluateRuntimeMemory } from './runtime-memory'
import { updateRuntimeRegistry, appendRuntimeWarning } from './runtime-state-registry'
import { evaluateRuntimeAwareness } from './runtime-awareness'
import { evaluateRuntimeRecovery } from './runtime-recovery'
import { evaluateAutonomousStabilization } from './runtime-autonomous-stabilizer'
import { registerRuntimeTelemetry } from './runtime-telemetry'
import { persistRuntimeSnapshot, readRuntimeSnapshots } from './runtime-snapshot'
import { analyzeRuntimeIntelligence } from './runtime-intelligence'
import { evaluateRuntimeIntelligencePolicy } from './runtime-policy-engine'
import { registerRuntimeIncident } from './runtime-incidents'
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

const budget = evaluateRuntimeBudget(context)

decisions.push(
  `budget:${budget.estimatedCostLevel}:${budget.reason}`
)

context = appendRuntimeTrace(
  context,
  `budget:${budget.providerBudgetAllowed ? 'allowed' : 'blocked'}:${budget.estimatedCostLevel}`
)

const providerGovernor = evaluateProviderGovernor(context)

decisions.push(
  `providerGovernor:${providerGovernor.escalationLevel}:${providerGovernor.reason}`
)

context = appendRuntimeTrace(
  context,
  `provider:${providerGovernor.recommendedProvider}:${providerGovernor.providerLocked}`
)

const memory = evaluateRuntimeMemory(context)
  decisions.push(
    `memory:${memory.memoryMode}:${memory.reason}`
  )

  context = appendRuntimeTrace(
    context,
    `memory:${memory.memoryEnabled ? 'enabled' : 'disabled'}:${memory.contextWindow}`
  )

  const runtimeRegistry = updateRuntimeRegistry({
    runtimeHealth: context.stable ? 'healthy' : 'degraded',
    runtimePressure: context.safeMode ? 60 : 20,
    providerPressure: providerGovernor.providerLocked ? 80 : 25,
    memoryPressure: memory.memoryMode === 'persistent' ? 50 : memory.memoryMode === 'session' ? 30 : 10,
    executionPressure: executionControl.allowed ? 20 : 85,
    degradationState: !context.stable || !executionControl.allowed,
    recoveryMode: !context.stable
  })

  if (!context.stable) {
    appendRuntimeWarning('Runtime instável detectado pelo State Registry.')
  }

  const awareness = evaluateRuntimeAwareness(runtimeRegistry)
  decisions.push(
    `awareness:${awareness.severity}:${awareness.diagnostic}`
  )

  context = appendRuntimeTrace(
    context,
    `awareness:${awareness.healthScore}:${awareness.severity}`
  )

  
const recovery = evaluateRuntimeRecovery(awareness)

decisions.push(
  `recovery:${recovery.recoveryMode}:${recovery.reason}`
)

context = appendRuntimeTrace(
  context,
  `recovery:${recovery.cooldownMs}:${recovery.recommendedProvider}`
)


if (!context.stable) {
  registerRuntimeIncident(
    'high',
    'runtime-state',
    'Runtime instável detectado.'
  )
}

if (recovery.recoveryMode) {
  registerRuntimeIncident(
    awareness.severity === 'critical'
      ? 'critical'
      : 'medium',
    'runtime-recovery',
    recovery.reason
  )
}


const autonomous = evaluateAutonomousStabilization(
  awareness,
  recovery
)

decisions.push(
  `autonomous:${autonomous.stabilizationLevel}:${autonomous.reason}`
)

context = appendRuntimeTrace(
  context,
  `autonomous:${autonomous.stabilizationScore}:${autonomous.cooldownMultiplier}`
)

const enforcement = enforceRuntimeExecution(context, governance)

decisions.push(`enforcement:${enforcement.severity}:${enforcement.reason}`)

context = appendRuntimeTrace(
  context,
  `enforcement:${enforcement.allowed ? 'allowed' : 'blocked'}:${enforcement.severity}`
)


  
registerRuntimeTelemetry({
  timestamp: new Date().toISOString(),
  latencyMs: Math.floor(Math.random() * 40) + 10,
  provider,
  mode,
  stable,
  awarenessSeverity: awareness.severity,
  recoveryMode: recovery.recoveryMode,
  stabilizationLevel: autonomous.stabilizationLevel,
  memoryMode: memory.memoryMode
})


persistRuntimeSnapshot({
  timestamp: new Date().toISOString(),
  stable,
  provider,
  mode,
  awareness: awareness.severity,
  recovery: recovery.recoveryMode,
  stabilization: autonomous.stabilizationLevel,
  memoryMode: memory.memoryMode
})


const intelligence = analyzeRuntimeIntelligence(
  readRuntimeSnapshots()
)

decisions.push(
  `intelligence:${intelligence.operationalScore}:${intelligence.degradationRisk}`
)

context = appendRuntimeTrace(
  context,
  `intelligence:${intelligence.stabilityRate}:${intelligence.recoveryFrequency}`
)


const runtimePolicy = evaluateRuntimeIntelligencePolicy(
  intelligence
)

decisions.push(
  `policy:${runtimePolicy.enforcementLevel}:${runtimePolicy.reason}`
)

context = appendRuntimeTrace(
  context,
  `policy:${runtimePolicy.forceLocalMode}:${runtimePolicy.throttleRequests}`
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
    budget,
    memory,
    runtimeRegistry,
    awareness,
    recovery,
    autonomous,
    decisions,
    stable
  }
}
