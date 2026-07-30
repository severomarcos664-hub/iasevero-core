import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  clearRuntimeTraceGraph,
  createRuntimeTraceNode,
  readRuntimeTraceGraph,
} from '../app/lib/runtime-core/runtime-distributed-trace-engine'

const correlationId = 'proof-v284.3-correlation'

clearRuntimeTraceGraph()

assert.equal(
  readRuntimeTraceGraph().length,
  0,
  'A Timeline deve iniciar vazia após clearRuntimeTraceGraph().',
)

const requestNode = createRuntimeTraceNode(
  'chat.request.received',
  null,
  'ok',
  {
    correlationId,
    userId: 'proof-user',
    messageLength: 24,
    executionApplied: false,
    mutationApplied: false,
  },
)

const runtimeNode = createRuntimeTraceNode(
  'chat.runtime.evaluated',
  requestNode.id,
  'ok',
  {
    correlationId,
    operationalState: 'stable',
    executionAllowed: true,
    executionApplied: false,
    mutationApplied: false,
  },
)

const responseNode = createRuntimeTraceNode(
  'chat.response.generated',
  runtimeNode.id,
  'ok',
  {
    correlationId,
    hasJob: false,
    replyLength: 42,
    executionApplied: false,
    mutationApplied: false,
  },
)

const timeline = readRuntimeTraceGraph()

assert.equal(
  timeline.length,
  3,
  'A Timeline deve conter exatamente três eventos.',
)

assert.deepEqual(
  timeline.map((node) => node.type),
  [
    'chat.request.received',
    'chat.runtime.evaluated',
    'chat.response.generated',
  ],
  'Os eventos devem preservar a ordem request → runtime → response.',
)

assert.equal(
  requestNode.parentId,
  null,
  'O evento inicial não deve possuir parentId.',
)

assert.equal(
  runtimeNode.parentId,
  requestNode.id,
  'O evento de runtime deve descender do evento de request.',
)

assert.equal(
  responseNode.parentId,
  runtimeNode.id,
  'O evento de response deve descender do evento de runtime.',
)

assert.ok(
  timeline.every(
    (node) => node.metadata.correlationId === correlationId,
  ),
  'Todos os eventos devem preservar o mesmo correlationId.',
)

assert.ok(
  timeline.every(
    (node) => node.metadata.executionApplied === false,
  ),
  'Nenhum evento pode declarar execução aplicada.',
)

assert.ok(
  timeline.every(
    (node) => node.metadata.mutationApplied === false,
  ),
  'Nenhum evento pode declarar mutação aplicada.',
)

const timestamps = timeline.map((node) =>
  Date.parse(node.timestamp),
)

assert.ok(
  timestamps.every((timestamp) => Number.isFinite(timestamp)),
  'Todos os timestamps devem ser válidos.',
)

assert.ok(
  timestamps.every(
    (timestamp, index) =>
      index === 0 || timestamp >= timestamps[index - 1],
  ),
  'Os timestamps devem preservar ordem não decrescente.',
)

const routeSource = readFileSync(
  'app/api/chat/route.ts',
  'utf8',
)

const requestEventPosition = routeSource.indexOf(
  "'chat.request.received'",
)
const runtimeEventPosition = routeSource.indexOf(
  "'chat.runtime.evaluated'",
)
const responseEventPosition = routeSource.indexOf(
  "'chat.response.generated'",
)

assert.ok(
  requestEventPosition >= 0,
  'A API deve registrar chat.request.received.',
)

assert.ok(
  runtimeEventPosition > requestEventPosition,
  'A API deve registrar chat.runtime.evaluated após o request.',
)

assert.ok(
  responseEventPosition > runtimeEventPosition,
  'A API deve registrar chat.response.generated após o runtime.',
)

assert.match(
  routeSource,
  /createRuntimeTraceNode\(\s*'chat\.runtime\.evaluated',\s*traceRequest\.id,/,
  'O trace de runtime deve descender do trace de request.',
)

assert.match(
  routeSource,
  /createRuntimeTraceNode\(\s*'chat\.response\.generated',\s*traceRuntime\.id,/,
  'O trace de response deve descender do trace de runtime.',
)

assert.match(
  routeSource,
  /correlationId:\s*runtimeMaster\.correlationId/,
  'A API deve registrar o correlationId canônico.',
)

assert.match(
  routeSource,
  /executionApplied:\s*false/,
  'A API deve preservar executionApplied=false.',
)

clearRuntimeTraceGraph()

assert.equal(
  readRuntimeTraceGraph().length,
  0,
  'A Timeline deve ficar vazia após a limpeza final.',
)

const result = {
  timelineInitiallyEmpty: true,
  requestEventCreated: requestNode.type === 'chat.request.received',
  runtimeEventCreated: runtimeNode.type === 'chat.runtime.evaluated',
  responseEventCreated: responseNode.type === 'chat.response.generated',
  eventOrderValid: true,
  parentChainValid:
    runtimeNode.parentId === requestNode.id &&
    responseNode.parentId === runtimeNode.id,
  correlationPreserved: timeline.every(
    (node) => node.metadata.correlationId === correlationId,
  ),
  timestampsOrdered: true,
  apiTraceChainPresent: true,
  timelineCleared: readRuntimeTraceGraph().length === 0,
  executionApplied: false,
  mutationApplied: false,
  totalEvents: timeline.length,
}

console.log(
  'Runtime governed execution timeline proof passed.',
)
console.log(result)
