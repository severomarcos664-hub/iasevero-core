import {
  clearRuntimeTraceGraph,
  createRuntimeTraceNode,
  readRuntimeTraceGraph,
} from '../app/lib/runtime-core/runtime-distributed-trace-engine'

clearRuntimeTraceGraph()

const request = createRuntimeTraceNode(
  'request.received',
  null,
  'ok',
  {
    userId: 'local-test',
  },
)

const governance = createRuntimeTraceNode(
  'governance.evaluated',
  request.id,
  'ok',
  {
    decision: 'NORMAL_OPERATION',
  },
)

const integrity = createRuntimeTraceNode(
  'integrity.checked',
  governance.id,
  'ok',
  {
    integrity: 'healthy',
  },
)

const execution = createRuntimeTraceNode(
  'execution.allowed',
  integrity.id,
  'ok',
  {
    executionAllowed: true,
  },
)

createRuntimeTraceNode(
  'response.generated',
  execution.id,
  'ok',
  {
    response: 'runtime operational',
  },
)

console.log('\n=== IASEVERO DISTRIBUTED TRACE ENGINE ===\n')
console.log(readRuntimeTraceGraph())
