import { superviseRuntimeAutonomously } from '../app/lib/runtime-core/runtime-autonomous-supervisor'

const supervision = superviseRuntimeAutonomously()

console.log('\n=== IASEVERO RUNTIME AUTONOMOUS SUPERVISOR ===\n')
console.log(supervision)
