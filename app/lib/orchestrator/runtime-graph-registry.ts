import { buildRuntimeDependencyGraph } from './runtime-dependency-graph'

export const runtimeGraphRegistry = buildRuntimeDependencyGraph([
  {
    module: 'RuntimeContext',
    dependencies: []
  },
  {
    module: 'RuntimeAwareness',
    dependencies: [
      'RuntimeContext'
    ]
  },
  {
    module: 'RuntimeTelemetry',
    dependencies: [
      'RuntimeContext'
    ]
  },
  {
    module: 'RuntimeSnapshot',
    dependencies: [
      'RuntimeTelemetry'
    ]
  },
  {
    module: 'RuntimeIntelligence',
    dependencies: [
      'RuntimeSnapshot',
      'RuntimeTelemetry',
      'RuntimeAwareness'
    ]
  },
  {
    module: 'RuntimePolicy',
    dependencies: [
      'RuntimeIntelligence'
    ]
  }
])
