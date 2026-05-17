import {
  getRuntimeArchitectureIndex,
  type RuntimeArchitectureModule
} from './runtime-architecture-index'

export type RuntimeDependencyIssue = {
  severity: 'low' | 'medium' | 'high'
  module: string
  reason: string
}

export type RuntimeDependencyReport = {
  valid: boolean
  totalModules: number
  issues: RuntimeDependencyIssue[]
}

const allowedDependencies: Record<string, string[]> = {
  core: [
    'governance',
    'execution',
    'budget',
    'provider',
    'memory',
    'state',
    'awareness',
    'recovery',
    'incidents',
    'stabilization',
    'telemetry',
    'snapshot',
    'intelligence',
    'policy'
  ],

  governance: [
    'budget',
    'provider',
    'memory',
    'state',
    'awareness',
    'policy'
  ],

  intelligence: [
    'snapshot',
    'telemetry',
    'awareness',
    'state'
  ],

  recovery: [
    'awareness',
    'incidents',
    'state'
  ],

  stabilization: [
    'awareness',
    'recovery',
    'incidents'
  ],

  telemetry: [
    'state',
    'memory'
  ],

  snapshot: [
    'telemetry',
    'state'
  ]
}

export function validateRuntimeDependencies(): RuntimeDependencyReport {
  const modules = getRuntimeArchitectureIndex()

  const issues: RuntimeDependencyIssue[] = []

  const names = new Set<string>()

  for (const module of modules) {
    if (names.has(module.name)) {
      issues.push({
        severity: 'high',
        module: module.name,
        reason: 'Nome duplicado detectado.'
      })
    }

    names.add(module.name)

    if (!module.file.endsWith('.ts')) {
      issues.push({
        severity: 'medium',
        module: module.name,
        reason: 'Arquivo sem extensão TypeScript.'
      })
    }

    if (!module.responsibility.length) {
      issues.push({
        severity: 'medium',
        module: module.name,
        reason: 'Responsabilidade vazia.'
      })
    }

    const allowed = allowedDependencies[module.layer]

    if (!allowed && module.layer !== 'core') {
      issues.push({
        severity: 'low',
        module: module.name,
        reason: 'Layer sem política explícita.'
      })
    }
  }

  return {
    valid: issues.filter(i => i.severity === 'high').length === 0,
    totalModules: modules.length,
    issues
  }
}
