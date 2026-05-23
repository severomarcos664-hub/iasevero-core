export type RuntimeToolCategory =
  | 'memory'
  | 'analysis'
  | 'execution'
  | 'validation'
  | 'workflow'

export type RuntimeToolRisk =
  | 'low'
  | 'medium'
  | 'high'

export type RuntimeTool = {
  id: string
  category: RuntimeToolCategory
  risk: RuntimeToolRisk
  timeoutMs: number
  retries: number
  fallback?: string
  allowed: boolean
  critical: boolean
}

export type RuntimeToolRegistryReport = {
  registryId: string
  createdAt: string
  source: 'runtime-tool-registry'
  tools: RuntimeTool[]
  totalTools: number
  allowedTools: number
  blockedTools: number
}

export function createRuntimeToolRegistry():
RuntimeToolRegistryReport {

  const tools: RuntimeTool[] = [
    {
      id: 'memory.search',
      category: 'memory',
      risk: 'low',
      timeoutMs: 2000,
      retries: 2,
      fallback: 'memory.local',
      allowed: true,
      critical: false,
    },

    {
      id: 'workflow.analysis',
      category: 'analysis',
      risk: 'medium',
      timeoutMs: 3000,
      retries: 1,
      fallback: 'workflow.safe-analysis',
      allowed: true,
      critical: true,
    },

    {
      id: 'execution.control',
      category: 'execution',
      risk: 'high',
      timeoutMs: 5000,
      retries: 0,
      fallback: 'execution.abort',
      allowed: true,
      critical: true,
    },

    {
      id: 'runtime.validation',
      category: 'validation',
      risk: 'medium',
      timeoutMs: 1500,
      retries: 1,
      fallback: 'validation.safe',
      allowed: true,
      critical: true,
    },
  ]

  return {
    registryId: `registry_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-tool-registry',

    tools,

    totalTools: tools.length,

    allowedTools:
      tools.filter(t => t.allowed).length,

    blockedTools:
      tools.filter(t => !t.allowed).length,
  }
}
