import assert from 'node:assert'

import { orchestrateRuntimeTools } from '../app/lib/runtime-core/runtime-tool-orchestrator'

const runtime = orchestrateRuntimeTools()

assert(runtime.totalTools > 0)
assert(runtime.selectedTools >= 0)
assert(runtime.blockedTools >= 0)
assert(runtime.workflowStable)
assert(runtime.executionAllowed)

console.log('Runtime governed tool registry API integration proof passed.')

console.log({
  totalTools: runtime.totalTools,
  selectedTools: runtime.selectedTools,
  blockedTools: runtime.blockedTools,
  workflowStable: runtime.workflowStable,
  executionAllowed: runtime.executionAllowed,
  executionApplied: false,
})
