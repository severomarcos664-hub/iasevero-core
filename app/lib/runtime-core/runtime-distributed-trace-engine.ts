export type RuntimeTraceNode = {
  id: string;
  parentId: string | null;
  type: string;
  timestamp: string;
  status: 'ok' | 'warning' | 'critical';
  metadata: Record<string, unknown>;
};

export type RuntimeTraceIntegrityReport = {
  valid: boolean;
  nodeCount: number;
  rootCount: number;
  duplicateNodeIds: string[];
  missingParentNodeIds: string[];
  selfParentNodeIds: string[];
  outOfOrderParentNodeIds: string[];
  cycleNodeIds: string[];
};

const runtimeTraceGraph: RuntimeTraceNode[] = [];

function cloneMetadata(
  metadata: Record<string, unknown>,
): Record<string, unknown> {
  return structuredClone(metadata);
}

function cloneRuntimeTraceNode(node: RuntimeTraceNode): RuntimeTraceNode {
  return {
    ...node,
    metadata: cloneMetadata(node.metadata),
  };
}

function runtimeTraceNodeExists(nodeId: string): boolean {
  return runtimeTraceGraph.some((node) => node.id === nodeId);
}

export function createRuntimeTraceNode(
  type: string,
  parentId: string | null,
  status: 'ok' | 'warning' | 'critical',
  metadata: Record<string, unknown> = {},
): RuntimeTraceNode {
  if (parentId !== null && !runtimeTraceNodeExists(parentId)) {
    throw new Error(
      `Runtime trace parentId does not exist: ${parentId}`,
    );
  }

  const node: RuntimeTraceNode = {
    id: `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    parentId,
    type,
    timestamp: new Date().toISOString(),
    status,
    metadata: cloneMetadata(metadata),
  };

  runtimeTraceGraph.push(node);

  return cloneRuntimeTraceNode(node);
}

export function readRuntimeTraceGraph(): RuntimeTraceNode[] {
  return runtimeTraceGraph.map(cloneRuntimeTraceNode);
}

export function validateRuntimeTraceGraph(): RuntimeTraceIntegrityReport {
  const nodeIndexes = new Map<string, number>();
  const nodesById = new Map<string, RuntimeTraceNode>();

  const duplicateNodeIds = new Set<string>();
  const missingParentNodeIds = new Set<string>();
  const selfParentNodeIds = new Set<string>();
  const outOfOrderParentNodeIds = new Set<string>();
  const cycleNodeIds = new Set<string>();

  runtimeTraceGraph.forEach((node, index) => {
    if (nodesById.has(node.id)) {
      duplicateNodeIds.add(node.id);
    }

    nodesById.set(node.id, node);
    nodeIndexes.set(node.id, index);
  });

  runtimeTraceGraph.forEach((node, index) => {
    if (node.parentId === null) {
      return;
    }

    if (node.parentId === node.id) {
      selfParentNodeIds.add(node.id);
    }

    const parentIndex = nodeIndexes.get(node.parentId);

    if (parentIndex === undefined) {
      missingParentNodeIds.add(node.id);
      return;
    }

    if (parentIndex >= index) {
      outOfOrderParentNodeIds.add(node.id);
    }
  });

  for (const startNode of runtimeTraceGraph) {
    const visitedInChain = new Set<string>();
    let currentNode: RuntimeTraceNode | undefined = startNode;

    while (currentNode) {
      if (visitedInChain.has(currentNode.id)) {
        cycleNodeIds.add(currentNode.id);
        break;
      }

      visitedInChain.add(currentNode.id);

      if (currentNode.parentId === null) {
        break;
      }

      currentNode = nodesById.get(currentNode.parentId);
    }
  }

  const report: RuntimeTraceIntegrityReport = {
    valid: false,
    nodeCount: runtimeTraceGraph.length,
    rootCount: runtimeTraceGraph.filter(
      (node) => node.parentId === null,
    ).length,
    duplicateNodeIds: [...duplicateNodeIds],
    missingParentNodeIds: [...missingParentNodeIds],
    selfParentNodeIds: [...selfParentNodeIds],
    outOfOrderParentNodeIds: [...outOfOrderParentNodeIds],
    cycleNodeIds: [...cycleNodeIds],
  };

  report.valid =
    report.duplicateNodeIds.length === 0 &&
    report.missingParentNodeIds.length === 0 &&
    report.selfParentNodeIds.length === 0 &&
    report.outOfOrderParentNodeIds.length === 0 &&
    report.cycleNodeIds.length === 0;

  return report;
}

export function clearRuntimeTraceGraph(): void {
  runtimeTraceGraph.length = 0;
}
