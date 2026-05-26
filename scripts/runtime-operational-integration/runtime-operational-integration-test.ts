import {
  evaluateRuntimeOperationalIntegration,
} from '../../app/lib/runtime-operational-integration/runtime-operational-integration'

const report =
  evaluateRuntimeOperationalIntegration()

console.log(
  '\n=== IASEVERO RUNTIME OPERATIONAL INTEGRATION ===\n'
)

console.log(report)
