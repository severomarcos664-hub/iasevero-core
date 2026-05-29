import {
  evaluateRuntimeExecutiveGovernanceLayer,
} from '../../app/lib/runtime-executive-governance-layer/runtime-executive-governance-layer'

const report =
  evaluateRuntimeExecutiveGovernanceLayer(
    'executar análise governada do runtime',
    'local',
    'general'
  )

console.log(
  '\n=== IASEVERO REGL - RUNTIME EXECUTIVE GOVERNANCE LAYER ===\n'
)

console.log(report)
