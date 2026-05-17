import { runtimeGraphRegistry } from './runtime-graph-registry'
import { validateRuntimeTopology } from './runtime-topology-validator'
import { evaluateStructuralHealth } from './runtime-structural-health'
import { analyzeRuntimeIntelligence } from './runtime-intelligence'

export type RuntimeArchitectureAudit = {
  valid: boolean
  risk: 'low' | 'medium' | 'high'
  topologyIssues: number
  overloadedModules: string[]
  recommendation: string
}

export function auditRuntimeArchitecture(): RuntimeArchitectureAudit {

  const topology = validateRuntimeTopology(runtimeGraphRegistry)

  const intelligence = analyzeRuntimeIntelligence([])

  const structural = evaluateStructuralHealth(
    topology,
    intelligence
  )

  const risk =
    structural.structuralRisk === 'high'
      ? 'high'
      : structural.structuralRisk === 'medium'
      ? 'medium'
      : 'low'

  return {
    valid: topology.valid,
    risk,
    topologyIssues: topology.issues.length,
    overloadedModules: topology.overloadedModules,
    recommendation: structural.recommendation
  }
}
