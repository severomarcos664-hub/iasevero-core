import {
  runRuntimeMasterOrchestrator,
} from '../app/lib/runtime-core/runtime-master-orchestrator'

const report = runRuntimeMasterOrchestrator()

console.log('\n=== IASEVERO RUNTIME MASTER ORCHESTRATOR ===\n')
console.log(report)
