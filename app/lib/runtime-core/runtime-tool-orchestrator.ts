import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from './runtime-tool-registry'
import { coordinateRuntimeWorkflow } from './runtime-workflow-coordinator'

export interface RuntimeOrchestratedTool {
  id: string
  selected: boolean
  strategy: string
  fallback: string
  critical: boolean
}

export interface RuntimeToolOrchestrationReport {
  orchestrationId: string
  createdAt: string
  workflowStable: boolean
  totalTools: number
  selectedTools: number
  blockedTools: number
  executionAllowed: boolean
  strategy: string
  tools: RuntimeOrchestratedTool[]
}

export function orchestrateRuntimeTools(): RuntimeToolOrchestrationReport {
  const registry = createRuntimeToolRegistry()
  const workflow = coordinateRuntimeWorkflow()

  const tools = registry.tools.map((tool: RuntimeTool) => ({
    id: tool.id,
    selected: tool.allowed,
    strategy:
      tool.risk === 'high'
        ? 'restricted'
        : 'standard',
    fallback: tool.fallback,
    critical: tool.critical
  }))

  const selectedTools =
    tools.filter((tool) => tool.selected).length

  const blockedTools =
    tools.filter((tool) => !tool.selected).length

  return {
    orchestrationId:
      `orch_${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    workflowStable:
      workflow.operationalState === 'stable',

    totalTools:
      tools.length,

    selectedTools,

    blockedTools,

    executionAllowed:
      workflow.executionAllowed,

    strategy:
      workflow.executionAllowed
        ? 'adaptive-orchestration'
        : 'restricted-orchestration',

    tools
  }
}
