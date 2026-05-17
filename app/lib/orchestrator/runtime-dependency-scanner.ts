export type RuntimeDependencyIssue = {
  severity: 'low' | 'medium' | 'high'
  module: string
  reason: string
}

export type RuntimeDependencyScanReport = {
  valid: boolean
  scannedModules: number
  issues: RuntimeDependencyIssue[]
}

export function scanRuntimeDependencies(
  modules: {
    name: string
    layer: string
    dependencies?: string[]
  }[]
): RuntimeDependencyScanReport {

  const issues: RuntimeDependencyIssue[] = []

  const moduleNames = new Set(
    modules.map(m => m.name)
  )

  for (const module of modules) {

    for (const dependency of module.dependencies || []) {

      if (!moduleNames.has(dependency)) {
        issues.push({
          severity: 'high',
          module: module.name,
          reason: `Dependência ausente: ${dependency}`
        })
      }

      if (dependency === module.name) {
        issues.push({
          severity: 'medium',
          module: module.name,
          reason: 'Auto dependência detectada.'
        })
      }
    }
  }

  return {
    valid: issues.filter(
      i => i.severity === 'high'
    ).length === 0,
    scannedModules: modules.length,
    issues
  }
}
