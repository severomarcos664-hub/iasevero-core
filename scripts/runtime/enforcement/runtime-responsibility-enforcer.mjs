import fs from 'fs'
import path from 'path'

const ROOTS = [
  'app/lib/orchestrator',
  'app/runtime'
]

const RULES = {
  governance: {
    forbidden: [
      './runtime-recovery',
      './runtime-self-healing',
      './runtime-conscious-loop'
    ]
  },

  observability: {
    forbidden: [
      './runtime-action-executor',
      './runtime-execution-control'
    ]
  },

  intelligence: {
    forbidden: [
      './runtime-governor',
      './runtime-execution-control'
    ]
  },

  autonomy: {
    forbidden: [
      './runtime-governor'
    ]
  },

  validation: {
    forbidden: [
      './runtime-action-executor'
    ]
  }
}

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

  let layer = null

  if (file.includes('governor') || file.includes('policy')) {
    layer = 'governance'
  }

  if (file.includes('telemetry') || file.includes('trace') || file.includes('metrics')) {
    layer = 'observability'
  }

  if (file.includes('intelligence') || file.includes('awareness')) {
    layer = 'intelligence'
  }

  if (file.includes('recovery') || file.includes('self-healing') || file.includes('conscious')) {
    layer = 'autonomy'
  }

  if (file.includes('validator') || file.includes('structural')) {
    layer = 'validation'
  }

  if (!layer) continue

  const imports = content
    .split('\n')
    .filter(line => line.startsWith('import'))

  for (const forbidden of RULES[layer].forbidden) {
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

console.log('\n=== IASevero Responsibility Enforcement ===\n')

if (findings.length === 0) {
  console.log('No responsibility violations detected.\n')
} else {
  console.log('Responsibility violations detected:\n')

  for (const finding of findings) {
    console.log(`[${finding.layer}]`)
    console.log(finding.file)
    console.log(finding.line)
    console.log()
  }
}

console.log(`Total findings: ${findings.length}\n`)
