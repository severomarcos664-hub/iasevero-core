import fs from 'fs'
import path from 'path'

const ROOTS = [
  'app/lib/orchestrator',
  'app/runtime'
]

const layerRules = {
  kernel: [
    'central-runtime-core',
    'runtime-context',
    'runtime-lifecycle',
    'runtime-registry',
    'runtime-state-registry'
  ],

  governance: [
    'runtime-governor',
    'runtime-policy',
    'runtime-policy-engine',
    'runtime-provider-governor',
    'runtime-budget-control',
    'runtime-enforcement'
  ],

  execution: [
    'runtime-execution-control',
    'runtime-action-executor',
    'hybrid-router',
    'runtime-coordinator'
  ],

  observability: [
    'runtime-telemetry',
    'metrics',
    'trace',
    'diagnostics',
    'runtime-incidents'
  ],

  intelligence: [
    'runtime-awareness',
    'runtime-intelligence',
    'runtime-intelligence-policy'
  ],

  autonomy: [
    'runtime-conscious-loop',
    'runtime-autonomous-decision',
    'runtime-self-healing',
    'runtime-recovery'
  ],

  validation: [
    'runtime-dependency-validator',
    'runtime-topology-validator',
    'runtime-structural-health'
  ]
}

function walk(dir) {
  let results = []

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      results = results.concat(walk(full))
    } else if (file.endsWith('.ts')) {
      results.push(full)
    }
  }

  return results
}

function resolveLayer(file) {
  for (const [layer, patterns] of Object.entries(layerRules)) {
    for (const pattern of patterns) {
      if (file.includes(pattern)) {
        return layer
      }
    }
  }

  return 'auxiliary'
}

const files = ROOTS.flatMap(walk)

const results = files.map(file => ({
  file,
  layer: resolveLayer(file)
}))

console.log('\n=== IASevero Runtime Layer Resolver ===\n')

for (const result of results) {
  console.log(`[${result.layer}] ${result.file}`)
}

const summary = {}

for (const result of results) {
  summary[result.layer] ??= 0
  summary[result.layer]++
}

console.log('\n=== Layer Summary ===\n')

for (const [layer, total] of Object.entries(summary)) {
  console.log(`${layer}: ${total}`)
}

console.log('\nResolver completed.\n')
