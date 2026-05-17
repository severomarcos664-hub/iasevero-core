import fs from 'fs'
import path from 'path'

const ROOTS = [
  'app/lib/orchestrator',
  'app/runtime'
]

const files = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      walk(full)
    } else if (full.endsWith('.ts')) {
      files.push(full)
    }
  }
}

for (const root of ROOTS) {
  if (fs.existsSync(root)) walk(root)
}

const graph = {}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')

  const imports = content
    .split('\n')
    .filter(line => line.startsWith('import'))

  graph[file] = imports.map(line => {
    const match = line.match(/from ['"](.*)['"]/)
    return match ? match[1] : null
  }).filter(Boolean)
}

console.log('\n=== IASevero Runtime Dependency Graph ===\n')

let totalEdges = 0

for (const [file, deps] of Object.entries(graph)) {
  console.log(file)

  if (deps.length === 0) {
    console.log('  -> no runtime dependencies')
  } else {
    for (const dep of deps) {
      console.log(`  -> ${dep}`)
      totalEdges++
    }
  }

  console.log('')
}

console.log('---')
console.log(`Runtime modules: ${Object.keys(graph).length}`)
console.log(`Runtime dependencies: ${totalEdges}`)

