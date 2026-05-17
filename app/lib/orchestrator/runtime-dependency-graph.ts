export type RuntimeDependencyNode = {
  module: string
  dependencies: string[]
}

export type RuntimeDependencyGraph = {
  nodes: RuntimeDependencyNode[]
  totalNodes: number
  totalEdges: number
}

export function buildRuntimeDependencyGraph(
  modules: RuntimeDependencyNode[]
): RuntimeDependencyGraph {

  let totalEdges = 0

  for (const module of modules) {
    totalEdges += module.dependencies.length
  }

  return {
    nodes: modules,
    totalNodes: modules.length,
    totalEdges
  }
}
