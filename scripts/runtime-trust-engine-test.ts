import {
  evaluateRuntimeTrustEngine,
} from '../app/lib/runtime-trust/runtime-trust-engine'

const report = evaluateRuntimeTrustEngine()

console.log('\n=== IASEVERO RUNTIME TRUST ENGINE ===\n')

console.log(report)
