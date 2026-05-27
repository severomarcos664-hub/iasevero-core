import {
  evaluateRuntimeExecutiveAuthorityGateway,
} from '../../app/lib/runtime-executive-authority-gateway/runtime-executive-authority-gateway'

const report =
  evaluateRuntimeExecutiveAuthorityGateway()

console.log(
  '\n=== IASEVERO RUNTIME EXECUTIVE AUTHORITY GATEWAY ===\n'
)

console.log(report)
