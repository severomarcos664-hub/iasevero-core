import {
  evaluateRuntimeExecutiveGovernor,
} from '../../app/lib/runtime-executive-governor/runtime-executive-governor'

const report =
  evaluateRuntimeExecutiveGovernor()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTIVE GOVERNOR ===\n'
)

console.log(report)
