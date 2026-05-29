import {
  evaluateRuntimeEnforcementAuthority
} from '../../app/lib/runtime-enforcement-authority/runtime-enforcement-authority'

const report =
  evaluateRuntimeEnforcementAuthority(
    'executar análise governada do runtime',
    'local',
    'general'
  )

console.log(
  '\n=== IASEVERO RUNTIME ENFORCEMENT AUTHORITY ===\n'
)

console.log(report)
