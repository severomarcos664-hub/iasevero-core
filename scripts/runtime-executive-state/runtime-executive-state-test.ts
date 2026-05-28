import {
  evaluateRuntimeExecutiveState
} from '../../app/lib/runtime-executive-state/runtime-executive-state'

const report =
  evaluateRuntimeExecutiveState(
    'executar análise runtime',
    'general'
  )

console.log(
  '\n=== IASEVERO EXECUTIVE RUNTIME STATE ===\n'
)

console.log(report)
