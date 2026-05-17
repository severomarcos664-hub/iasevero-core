export const LAYER_RULES = {
  observability: {
    forbidden: [
      'runtime-action-executor',
      'runtime-execution-control',
      'hybrid-router'
    ]
  },

  autonomy: {
    forbidden: [
      'runtime-governor',
      'runtime-policy',
      'runtime-budget-control',
      'runtime-provider-governor'
    ]
  },

  validation: {
    forbidden: [
      'runtime-action-executor',
      'runtime-self-healing',
      'runtime-conscious-loop'
    ]
  },

  intelligence: {
    forbidden: [
      'runtime-governor',
      'runtime-execution-control'
    ]
  }
}
