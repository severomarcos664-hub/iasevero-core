import {
  evaluateRuntimeProviderAuthority
} from '../../app/lib/runtime-provider-authority/runtime-provider-authority'

const report =
  evaluateRuntimeProviderAuthority(
    'executar análise cognitiva',
    'general'
  )

console.log(
  '\n=== IASEVERO RUNTIME PROVIDER AUTHORITY ===\n'
)

console.log(report)
