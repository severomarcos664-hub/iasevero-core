import fs from 'fs'
import path from 'path'

const ROOTS = [
  'app/lib/orchestrator',
  'app/runtime'
]

const suspiciousPatterns = [
  {
    name: 'Autonomy touching Governance',
    source: /(self-healing|autonomous|recovery|conscious)/,
    target: /(governor|policy|budget|provider-governor|enforcement)/
  },
  {
    name: 'Observability touching Execution',
    source: /(telemetry|metrics|diagnostic|incident|trace)/,
    target: /(execution-control|action-executor|hybrid-router)/
  },
  {
    name: 'Validation touching Execution',
    source: /(validator|dependency|topology|structural)/,
    target: /(execution-control|action-executor|self-healing)/
  }
]

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

const files = ROOTS.flatMap(walk)

const findings = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')

  const imports = content
    .split('\n')
    .filter(line => line.startsWith('import'))

  for (const rule of suspiciousPatterns) {
    const sourceMatch = rule.source.test(file)

    if (!sourceMatch) continue

    for (const line of imports) {
      if (rule.target.test(line)) {
        findings.push({
          rule: rule.name,
          file,
          line
        })
      }
    }
  }
}

console.log('\n=== IASevero Runtime Anti-Fragmentation Report ===\n')

if (findings.length === 0) {
  console.log('No architectural fragmentation violations detected.\n')
} else {
  for (const finding of findings) {
    console.log(`[${finding.rule}]`)
    console.log(finding.file)
    console.log(finding.line)
    console.log('')
  }
}

console.log(`Total findings: ${findings.length}\n`)
