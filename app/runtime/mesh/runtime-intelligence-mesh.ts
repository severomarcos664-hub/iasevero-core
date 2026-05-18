export interface RuntimeMeshNode {
  id: string
  type: string
  active: boolean
}

export class RuntimeIntelligenceMesh {
  private nodes = new Map<string, RuntimeMeshNode>()

  register(node: RuntimeMeshNode) {
    this.nodes.set(node.id, node)
  }

  remove(nodeId: string) {
    this.nodes.delete(nodeId)
  }

  snapshot() {
    return {
      total: this.nodes.size,
      active: Array.from(
        this.nodes.values()
      ).filter(node => node.active).length,
      nodes: Array.from(this.nodes.values())
    }
  }
}

export const runtimeIntelligenceMesh =
  new RuntimeIntelligenceMesh()
