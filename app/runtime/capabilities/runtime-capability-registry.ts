export const RUNTIME_CAPABILITIES = {
  governance: [
    'approve-execution',
    'deny-execution',
    'validate-provider',
    'validate-policy',
    'read-runtime-state'
  ],

  execution: [
    'execute-approved-action',
    'resolve-provider',
    'route-runtime-request'
  ],

  observability: [
    'observe-runtime',
    'emit-telemetry',
    'report-incidents',
    'collect-metrics'
  ],

  intelligence: [
    'analyze-runtime',
    'evaluate-runtime-health',
    'suggest-runtime-actions'
  ],

  autonomy: [
    'request-recovery',
    'request-stabilization',
    'request-self-healing'
  ],

  validation: [
    'validate-topology',
    'validate-dependencies',
    'validate-runtime-structure'
  ]
} as const
