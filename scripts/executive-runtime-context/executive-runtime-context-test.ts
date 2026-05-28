import {
  buildExecutiveRuntimeContext,
} from '../../app/lib/executive-runtime-context/executive-runtime-context'

const report =
  buildExecutiveRuntimeContext(
    'executar análise governada do runtime',
    'local',
    'general'
  )

console.log(
  '\n=== IASEVERO EXECUTIVE RUNTIME CONTEXT ===\n'
)

console.log(report)
