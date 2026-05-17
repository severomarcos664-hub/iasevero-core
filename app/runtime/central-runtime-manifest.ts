export const CENTRAL_RUNTIME_MANIFEST = {
  version: '8.1',
  codename: 'central-runtime-manifest',
  status: 'stable',

  authority: {
    kernel: [
      'runtime-context',
      'runtime-state-registry',
      'runtime-lifecycle-manager'
    ],
    orchestrator: [
      'runtime-decision-engine'
    ],
    governance: [
      'runtime-governor',
      'runtime-policy',
      'runtime-policy-engine',
      'runtime-enforcement',
      'runtime-provider-governor',
      'runtime-budget-control'
    ],
    execution: [
      'runtime-execution-control',
      'runtime-action-executor',
      'hybrid-router'
    ],
    observability: [
      'runtime-telemetry',
      'runtime-incidents',
      'metrics',
      'trace',
      'diagnostics'
    ],
    intelligence: [
      'runtime-awareness',
      'runtime-intelligence',
      'runtime-intelligence-policy'
    ],
    autonomy: [
      'runtime-conscious-loop',
      'runtime-self-healing',
      'runtime-recovery',
      'runtime-autonomous-stabilizer'
    ],
    validation: [
      'runtime-dependency-validator',
      'runtime-topology-validator',
      'runtime-structural-health'
    ]
  },

  rules: {
    decisionEngineIsKernel: false,
    autonomyCanGovern: false,
    observabilityCanExecute: false,
    validationCanExecute: false,
    executionRequiresGovernance: true,
    runtimeStateRequiresSingleAuthority: true
  }
} as const
