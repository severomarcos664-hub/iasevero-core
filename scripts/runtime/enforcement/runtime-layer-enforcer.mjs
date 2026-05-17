import fs from 'fs'
import path from 'path'
import { LAYER_RULES } from './rules/runtime-layer-authority.mjs'

const ROOTS = [
  'app/lib/orchestrator',
  'app/runtime'
]

function walk(dir) {
  const entries = fs.readdirSync(dir)
  let results = []

  for (const entry of entries) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      results = results.concat(walk(full))
    } else if (full.endsWith('.ts')) {
      results.push(full)
    }
  }

  return results
}

const files = ROOTS.flatMap(walk)

const findings = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')

  for (const [layer, config] of Object.entries(LAYER_RULES)) {
    if (!file.includes(layer)) continue

    const imports = content
      .split('\n')
      .filter(line => line.startsWith('import'))

    for (const forbidden of config.forbidden) {
      for (const line of imports) {
        if (line.includes(forbidden)) {
          findings.push({
            layer,
            forbidden,
            file,
            line
          })
        }
      }
    }
  }
}

console.log('\n=== IASevero Runtime Layer Enforcement ===\n')

if (findings.length === 0) {
  console.log('No layer authority violations detected.\n')
} else {
  for (const finding of findings) {
    console.log(`[${finding.layer}] forbidden import`)
    console.log(finding.file)
    console.log(finding.line)
    console.log()
  }

  process.exit(1)
}
