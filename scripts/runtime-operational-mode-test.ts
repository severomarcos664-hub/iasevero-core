import {
  evaluateRuntimeOperationalMode,
} from '../app/lib/runtime-operational/runtime-operational-mode-switcher'

const report = evaluateRuntimeOperationalMode()

console.log('\n=== IASEVERO RUNTIME OPERATIONAL MODE ===\n')

console.log(report)
