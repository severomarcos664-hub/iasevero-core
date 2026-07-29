import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from '../app/lib/runtime-core/runtime-tool-registry'
import {
  orchestrateRuntimeTools,
} from '../app/lib/runtime-core/runtime-tool-orchestrator'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

const registry = createRuntimeToolRegistry()
const orchestration = orchestrateRuntimeTools()

assert(registry.source === 'runtime-tool-registry', 'Registry source inválido.')
assert(registry.totalTools === registry.tools.length, 'Contagem total inconsistente.')

const allowedTools = registry.tools.filter((tool: RuntimeTool) => tool.allowed)
const blockedTools = registry.tools.filter((tool: RuntimeTool) => !tool.allowed)

assert(
  registry.allowedTools === allowedTools.length,
  'Contagem de ferramentas permitidas inconsistente.',
)

assert(
  registry.blockedTools === blockedTools.length,
  'Contagem de ferramentas bloqueadas inconsistente.',
)

assert(
  orchestration.totalTools === registry.totalTools,
  'Orchestrator não preservou o total do Registry.',
)

assert(
  orchestration.selectedTools === registry.allowedTools,
  'Orchestrator não preservou a seleção permitida.',
)

assert(
  orchestration.blockedTools === registry.blockedTools,
  'Orchestrator não preservou a seleção bloqueada.',
)

assert(
  orchestration.tools.every((tool) => tool.fallback.length > 0),
  'Existe ferramenta sem fallback obrigatório.',
)

assert(
  orchestration.tools.every(
    (tool) =>
      tool.selected ===
      registry.tools.find((registeredTool) => registeredTool.id === tool.id)?.allowed,
  ),
  'Seleção do Orchestrator diverge do Registry.',
)

const result = {
  registryCreated: true,
  sourceValid: registry.source === 'runtime-tool-registry',
  totalToolsConsistent: registry.totalTools === registry.tools.length,
  allowedToolsConsistent: registry.allowedTools === allowedTools.length,
  blockedToolsConsistent: registry.blockedTools === blockedTools.length,
  orchestratorConsumedRegistry:
    orchestration.totalTools === registry.totalTools,
  selectedToolsConsistent:
    orchestration.selectedTools === registry.allowedTools,
  blockedToolsOrchestrationConsistent:
    orchestration.blockedTools === registry.blockedTools,
  fallbacksPreserved:
    orchestration.tools.every((tool) => tool.fallback.length > 0),
  workflowStable: orchestration.workflowStable,
  executionAllowed: orchestration.executionAllowed,
  executionApplied: false,
  toolCount: registry.totalTools,
}

console.log('Runtime governed tool registry foundation proof passed.')
console.log(result)
