import { clearRuntimeQueue } from '../app/lib/runtime-core/runtime-queue-manager'
import { balanceRuntimeLoad } from '../app/lib/runtime-core/runtime-load-balancer'
import { superviseRuntimeLanes } from '../app/lib/runtime-core/runtime-lane-supervisor'

clearRuntimeQueue()

balanceRuntimeLoad('observe', 'low')
balanceRuntimeLoad('stabilize', 'high')
balanceRuntimeLoad('recover-runtime', 'high')
balanceRuntimeLoad('contain-runtime', 'critical')

const report = superviseRuntimeLanes()

console.log('\n=== IASEVERO RUNTIME LANE SUPERVISOR ===\n')
console.log(report)
