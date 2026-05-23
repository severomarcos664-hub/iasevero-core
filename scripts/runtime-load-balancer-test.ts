import { clearRuntimeQueue } from '../app/lib/runtime-core/runtime-queue-manager'
import { balanceRuntimeLoad } from '../app/lib/runtime-core/runtime-load-balancer'

clearRuntimeQueue()

console.log('\n=== IASEVERO RUNTIME LOAD BALANCER ===\n')

console.log(balanceRuntimeLoad('observe', 'low'))
console.log(balanceRuntimeLoad('stabilize', 'high'))
console.log(balanceRuntimeLoad('recover-runtime', 'high'))
console.log(balanceRuntimeLoad('contain-runtime', 'critical'))
