import {
  evaluateRuntimeOperationalStateEngine,
} from '../../app/lib/runtime-state-engine/runtime-operational-state-engine'

const report =
  evaluateRuntimeOperationalStateEngine()

console.log(
  '\n=== IASEVERO RUNTIME OPERATIONAL STATE ENGINE ===\n'
)

console.log(report)
