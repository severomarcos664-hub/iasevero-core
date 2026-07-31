import assert from "node:assert/strict"
import fs from "node:fs"

const read = (path: string): string => fs.readFileSync(path, "utf8")

const route = read("app/api/chat/route.ts")
const decisionEngine = read("app/lib/orchestrator/runtime-decision-engine.ts")
const toolOrchestrator = read("app/lib/runtime-core/runtime-tool-orchestrator.ts")
const capabilityRegistry = read("app/runtime/capabilities/runtime-capability-registry.ts")

assert.match(route, /executeRuntimeDecisionEngine\(\)/)
assert.match(route, /evaluateRuntimeDecisionGate\(/)
assert.match(route, /evaluateRuntimeActionPolicy\(\)/)
assert.match(route, /orchestrateRuntimeTools\(\)/)
assert.match(route, /RuntimeEnterpriseCognitiveMemoryRepository/)
assert.match(route, /retrieveHybridEnterpriseMemories\(/)
assert.match(route, /createRuntimeTraceNode\(/)

assert.match(toolOrchestrator, /createRuntimeToolRegistry\(\)/)
assert.match(decisionEngine, /evaluateProviderGovernor\(/)

const plannerImportedByRoute =
  /runtime-task-planner/.test(route) || /planRuntimeTasks\(/.test(route)

assert.equal(
  plannerImportedByRoute,
  false,
  "Task Planner must not be claimed as integrated into /api/chat without evidence.",
)

assert.match(capabilityRegistry, /canonicalOwner/)
assert.match(capabilityRegistry, /evidenceIds/)
assert.match(capabilityRegistry, /implementationClaim/)
assert.match(capabilityRegistry, /localFirst/)
assert.match(capabilityRegistry, /externalProviderRequired/)

const result = {
  decisionEngineIntegrated: true,
  decisionGateIntegrated: true,
  actionPolicyIntegrated: true,
  toolOrchestratorIntegrated: true,
  toolRegistryConsumed: true,
  memoryRepositoryIntegrated: true,
  hybridRetrievalIntegrated: true,
  traceIntegrated: true,
  providerGovernorIntegrated: true,
  taskPlannerIntegratedIntoChat: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log("Runtime enterprise architecture alignment proof passed.")
console.log(result)
