export type RuntimeTraceNode = {
  id: string
  parentId: string | null
  type: string
  timestamp: string
  status: 'ok' | 'warning' | 'critical'
  metadata: Record<string, unknown>
}

const runtimeTraceGraph: RuntimeTraceNode[] = []

export function createRuntimeTraceNode(
  type: string,
  parentId: string | null,
  status: 'ok' | 'warning' | 'critical',
  metadata: Record<string, unknown> = {},
): RuntimeTraceNode {
  const node: RuntimeTraceNode = {
    id: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    parentId,
    type,
    timestamp: new Date().toISOString(),
    status,
    metadata,
  }

  runtimeTraceGraph.push(node)

  return node
}

export function readRuntimeTraceGraph(): RuntimeTraceNode[] {
  return [...runtimeTraceGraph]
}

export function clearRuntimeTraceGraph(): void {
  runtimeTraceGraph.length = 0
}
