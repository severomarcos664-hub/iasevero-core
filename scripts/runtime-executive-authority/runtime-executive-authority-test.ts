import {
  evaluateRuntimeExecutiveAuthority,
} from '../../app/lib/runtime-executive-authority/runtime-executive-authority'

const report =
  evaluateRuntimeExecutiveAuthority()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTIVE AUTHORITY ===\n'
)

console.log(report)
