import type { RuntimeDependencyGraph } from './runtime-dependency-graph'

export type RuntimeTopologyIssue = {
  severity: 'low' | 'medium' | 'high'
  module: string
  reason: string
}

export type RuntimeTopologyReport = {
  valid: boolean
  totalNodes: number
  totalEdges: number
  isolatedModules: string[]
  overloadedModules: string[]
  issues: RuntimeTopologyIssue[]
}

export function validateRuntimeTopology(
  graph: RuntimeDependencyGraph
): RuntimeTopologyReport {

  const issues: RuntimeTopologyIssue[] = []

  const isolatedModules: string[] = []

  const overloadedModules: string[] = []

  for (const node of graph.nodes) {

    if (node.dependencies.length === 0) {
      isolatedModules.push(node.module)
    }

    if (node.dependencies.length >= 5) {
      overloadedModules.push(node.module)

      issues.push({
        severity: 'medium',
        module: node.module,
        reason: 'Módulo excessivamente acoplado.'
      })
    }

    if (node.dependencies.includes(node.module)) {
      issues.push({
        severity: 'high',
        module: node.module,
        reason: 'Dependência circular própria detectada.'
      })
    }
  }

  return {
    valid: issues.filter(i => i.severity === 'high').length === 0,
    totalNodes: graph.totalNodes,
    totalEdges: graph.totalEdges,
    isolatedModules,
    overloadedModules,
    issues
  }
}
