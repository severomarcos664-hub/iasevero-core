import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from '../app/lib/runtime-core/runtime-tool-registry'
import { orchestrateRuntimeTools } from '../app/lib/runtime-core/runtime-tool-orchestrator'

const registry = createRuntimeToolRegistry()
const orchestration = orchestrateRuntimeTools()

const allowedTools = registry.tools.filter((tool: RuntimeTool) => tool.allowed)
const blockedTools = registry.tools.filter((tool: RuntimeTool) => !tool.allowed)

assert.equal(
  registry.source,
  'runtime-tool-registry',
  'O Registry deve declarar sua origem canônica.',
)

assert.equal(
  registry.totalTools,
  registry.tools.length,
  'O total do Registry deve corresponder ao catálogo real.',
)

assert.equal(
  registry.allowedTools,
  allowedTools.length,
  'A contagem de ferramentas permitidas deve nascer do Registry.',
)

assert.equal(
  registry.blockedTools,
  blockedTools.length,
  'A contagem de ferramentas bloqueadas deve nascer do Registry.',
)

assert.equal(
  orchestration.totalTools,
  registry.totalTools,
  'O Orchestrator deve preservar o total canônico do Registry.',
)

assert.equal(
  orchestration.selectedTools,
  registry.allowedTools,
  'O Orchestrator deve selecionar exatamente as ferramentas permitidas pelo Registry.',
)

assert.equal(
  orchestration.blockedTools,
  registry.blockedTools,
  'O Orchestrator deve preservar os bloqueios definidos pelo Registry.',
)

for (const orchestratedTool of orchestration.tools) {
  const registeredTool = registry.tools.find(
    (tool: RuntimeTool) => tool.id === orchestratedTool.id,
  )

  assert.ok(
    registeredTool,
    `Ferramenta ${orchestratedTool.id} não existe no Registry canônico.`,
  )

  assert.equal(
    orchestratedTool.selected,
    registeredTool.allowed,
    `A seleção de ${orchestratedTool.id} divergiu da disponibilidade canônica.`,
  )

  assert.ok(
    orchestratedTool.fallback.length > 0,
    `A ferramenta ${orchestratedTool.id} deve preservar fallback obrigatório.`,
  )
}

const routeSource = readFileSync('app/api/chat/route.ts', 'utf8')

const decisionGateEvaluation = routeSource.indexOf(
  'const decisionGate = evaluateRuntimeDecisionGate(',
)
const decisionGateBlock = routeSource.indexOf(
  'if (!decisionGate.allowed)',
)
const actionPolicyEvaluation = routeSource.indexOf(
  'const actionPolicy = evaluateRuntimeActionPolicy()',
)
const actionPolicyBlock = routeSource.indexOf(
  'if (!actionPolicy.allowExecution)',
)
const toolOrchestrationObservation = routeSource.indexOf(
  'const toolOrchestration = orchestrateRuntimeTools()',
)

assert.ok(
  decisionGateEvaluation >= 0,
  'A API deve avaliar o Runtime Decision Gate.',
)

assert.ok(
  decisionGateBlock > decisionGateEvaluation,
  'A API deve aplicar o bloqueio do Decision Gate após avaliá-lo.',
)

assert.ok(
  actionPolicyEvaluation >= 0,
  'A API deve avaliar a Runtime Action Policy.',
)

assert.ok(
  actionPolicyBlock > actionPolicyEvaluation,
  'A API deve aplicar o bloqueio da Action Policy após avaliá-la.',
)

assert.ok(
  toolOrchestrationObservation > decisionGateBlock,
  'A observação das ferramentas deve ocorrer após o gate canônico.',
)

assert.ok(
  toolOrchestrationObservation > actionPolicyBlock,
  'A observação das ferramentas deve ocorrer após a política de ação.',
)

assert.match(
  routeSource,
  /toolGovernance[\s\S]*executionApplied:\s*false/,
  'A integração deve declarar explicitamente executionApplied=false.',
)

const result = {
  registryCanonical: true,
  registrySourceValid: registry.source === 'runtime-tool-registry',
  orchestratorConsumesRegistry:
    orchestration.totalTools === registry.totalTools,
  allowedToolsConsistent:
    orchestration.selectedTools === registry.allowedTools,
  blockedToolsConsistent:
    orchestration.blockedTools === registry.blockedTools,
  decisionGateAppliedBeforeObservation:
    decisionGateBlock < toolOrchestrationObservation,
  actionPolicyAppliedBeforeObservation:
    actionPolicyBlock < toolOrchestrationObservation,
  fallbackPreserved: orchestration.tools.every(
    (tool) => tool.fallback.length > 0,
  ),
  executionAllowed: orchestration.executionAllowed,
  executionApplied: false,
  mutationApplied: false,
  totalTools: registry.totalTools,
  allowedTools: registry.allowedTools,
  blockedTools: registry.blockedTools,
}

console.log(
  'Runtime governed tool availability canonicalization proof passed.',
)
console.log(result)
