import {
  createRuntimeExecutionGraph
} from './runtime-execution-graph-engine'

export type RuntimeWorkflowReport = {
  workflowId: string
  createdAt: string
  operationalState: string
  totalSteps: number
  completedSteps: number
  pendingSteps: number
  executionAllowed: boolean
  recommendation: string
  executionOrder: string[]
}

export function coordinateRuntimeWorkflow() {
  const graph = createRuntimeExecutionGraph()

  const completedSteps =
    graph.nodes.filter(n => n.status === 'completed').length

  const pendingSteps =
    graph.nodes.filter(n => n.status !== 'completed').length

  const executionAllowed =
    graph.valid &&
    graph.executionOrder.length > 0

  return {
    workflowId: `workflow_${Date.now()}`,
    createdAt: new Date().toISOString(),

    operationalState:
      executionAllowed
        ? 'stable'
        : 'blocked',

    totalSteps: graph.nodes.length,

    completedSteps,
    pendingSteps,

    executionAllowed,

    recommendation:
      executionAllowed
        ? 'Workflow execution authorized.'
        : 'Workflow execution blocked.',

    executionOrder: graph.executionOrder
  }
}
