import { evaluateRuntimeRetention } from '../app/lib/runtime-core/runtime-retention-manager'

const retention = evaluateRuntimeRetention()

console.log('\n=== IASEVERO RUNTIME RETENTION MANAGER ===\n')
console.log(retention)
