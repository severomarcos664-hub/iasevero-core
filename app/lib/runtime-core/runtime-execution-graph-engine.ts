export type RuntimeExecutionNode = {
  id: string
  title: string
  type: string
  dependsOn: string[]
  status: 'pending' | 'ready' | 'running' | 'completed'
}

export type RuntimeExecutionGraph = {
  graphId: string
  createdAt: string
  nodes: RuntimeExecutionNode[]
  valid: boolean
  executionOrder: string[]
}

export function createRuntimeExecutionGraph() {
  const nodes: RuntimeExecutionNode[] = [
    {
      id: 'analysis',
      title: 'Analyze runtime context',
      type: 'analysis',
      dependsOn: [],
      status: 'completed'
    },

    {
      id: 'execution',
      title: 'Prepare controlled execution',
      type: 'execution',
      dependsOn: ['analysis'],
      status: 'ready'
    },

    {
      id: 'validation',
      title: 'Validate runtime result',
      type: 'validation',
      dependsOn: ['execution'],
      status: 'pending'
    },

    {
      id: 'synthesis',
      title: 'Synthesize final response',
      type: 'synthesis',
      dependsOn: ['validation'],
      status: 'pending'
    }
  ]

  return {
    graphId: `graph_${Date.now()}`,
    createdAt: new Date().toISOString(),
    nodes,
    valid: true,
    executionOrder: [
      'analysis',
      'execution',
      'validation',
      'synthesis'
    ]
  }
}
