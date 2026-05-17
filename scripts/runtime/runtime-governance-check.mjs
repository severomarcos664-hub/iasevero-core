import { spawnSync } from 'node:child_process'

const checks = [
  'scripts/runtime/resolver/runtime-layer-resolver.mjs',
  'scripts/runtime/enforcement/runtime-layer-enforcer.mjs',
  'scripts/runtime/enforcement/runtime-responsibility-enforcer.mjs',
  'scripts/runtime/graph/runtime-dependency-graph.mjs'
]

let failed = false

for (const check of checks) {
  console.log(`\n=== Running ${check} ===\n`)

  const result = spawnSync('node', [check], {
    encoding: 'utf8',
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    failed = true
  }
}

if (failed) {
  console.error('\nRuntime governance check failed.\n')
  process.exit(1)
}

console.log('\nRuntime governance check passed.\n')
