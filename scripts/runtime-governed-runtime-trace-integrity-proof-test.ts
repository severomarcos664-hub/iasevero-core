import assert from 'node:assert/strict';

import {
  clearRuntimeTraceGraph,
  createRuntimeTraceNode,
  readRuntimeTraceGraph,
  validateRuntimeTraceGraph,
} from '../app/lib/runtime-core/runtime-distributed-trace-engine';

clearRuntimeTraceGraph();

assert.equal(
  readRuntimeTraceGraph().length,
  0,
  'O trace deve iniciar vazio.',
);

const sourceMetadata = {
  correlationId: 'proof-v284.4-correlation',
  nested: {
    executionApplied: false,
    mutationApplied: false,
  },
};

const requestNode = createRuntimeTraceNode(
  'chat.request.received',
  null,
  'ok',
  sourceMetadata,
);

sourceMetadata.correlationId = 'externally-mutated-correlation';
sourceMetadata.nested.executionApplied = true;
sourceMetadata.nested.mutationApplied = true;

const requestNodeMetadata = requestNode.metadata as {
  correlationId: string;
  nested: {
    executionApplied: boolean;
    mutationApplied: boolean;
  };
};

requestNodeMetadata.correlationId = 'returned-node-mutated';
requestNodeMetadata.nested.executionApplied = true;

let timeline = readRuntimeTraceGraph();

const persistedRequestMetadata = timeline[0].metadata as {
  correlationId: string;
  nested: {
    executionApplied: boolean;
    mutationApplied: boolean;
  };
};

assert.equal(
  persistedRequestMetadata.correlationId,
  'proof-v284.4-correlation',
  'A alteração do metadata original não pode modificar o trace.',
);

assert.equal(
  persistedRequestMetadata.nested.executionApplied,
  false,
  'A alteração do nó retornado não pode modificar o trace interno.',
);

assert.equal(
  persistedRequestMetadata.nested.mutationApplied,
  false,
  'mutationApplied deve permanecer falso no trace persistido.',
);

const runtimeNode = createRuntimeTraceNode(
  'chat.runtime.evaluated',
  requestNode.id,
  'ok',
  {
    correlationId: 'proof-v284.4-correlation',
    executionApplied: false,
    mutationApplied: false,
  },
);

createRuntimeTraceNode(
  'chat.response.generated',
  runtimeNode.id,
  'ok',
  {
    correlationId: 'proof-v284.4-correlation',
    executionApplied: false,
    mutationApplied: false,
  },
);

timeline = readRuntimeTraceGraph();

assert.equal(timeline.length, 3);
assert.equal(timeline[0].parentId, null);
assert.equal(timeline[1].parentId, timeline[0].id);
assert.equal(timeline[2].parentId, timeline[1].id);

const externalSnapshotMetadata = timeline[0].metadata as {
  correlationId: string;
};

externalSnapshotMetadata.correlationId = 'snapshot-mutated';

assert.equal(
  (
    readRuntimeTraceGraph()[0].metadata as {
      correlationId: string;
    }
  ).correlationId,
  'proof-v284.4-correlation',
  'A alteração do snapshot lido não pode modificar o armazenamento interno.',
);

assert.throws(
  () =>
    createRuntimeTraceNode(
      'chat.invalid-parent',
      'trace-parent-does-not-exist',
      'critical',
      {},
    ),
  /Runtime trace parentId does not exist/,
  'parentId inexistente deve ser bloqueado.',
);

const integrity = validateRuntimeTraceGraph();

assert.equal(integrity.valid, true);
assert.equal(integrity.nodeCount, 3);
assert.equal(integrity.rootCount, 1);
assert.deepEqual(integrity.duplicateNodeIds, []);
assert.deepEqual(integrity.missingParentNodeIds, []);
assert.deepEqual(integrity.selfParentNodeIds, []);
assert.deepEqual(integrity.outOfOrderParentNodeIds, []);
assert.deepEqual(integrity.cycleNodeIds, []);

clearRuntimeTraceGraph();

assert.equal(
  readRuntimeTraceGraph().length,
  0,
  'O trace deve ficar vazio após a limpeza.',
);

console.log('Runtime governed trace integrity proof passed.');
console.log({
  defensiveMetadataWrite: true,
  defensiveNodeReturn: true,
  defensiveGraphRead: true,
  invalidParentBlocked: true,
  integrityValid: integrity.valid,
  nodeCount: integrity.nodeCount,
  rootCount: integrity.rootCount,
  executionApplied: false,
  mutationApplied: false,
  traceCleared: readRuntimeTraceGraph().length === 0,
});
