import {
  coordinateRuntimeWorkflow
} from '../app/lib/runtime-core/runtime-workflow-coordinator'

const workflow = coordinateRuntimeWorkflow()

console.log('\n=== IASEVERO WORKFLOW COORDINATOR ===\n')
console.log(workflow)
