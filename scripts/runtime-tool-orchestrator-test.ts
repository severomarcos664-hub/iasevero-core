import {
  orchestrateRuntimeTools
} from '../app/lib/runtime-core/runtime-tool-orchestrator'

const report =
  orchestrateRuntimeTools()

console.log(
  '\n=== IASEVERO TOOL ORCHESTRATOR ===\n'
)

console.log(report)
