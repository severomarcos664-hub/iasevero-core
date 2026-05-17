import { spawnSync } from 'node:child_process'

const result = spawnSync(
  'node',
  ['scripts/runtime/runtime-anti-fragmentation-scanner.mjs'],
  { encoding: 'utf8' }
)

process.stdout.write(result.stdout)
process.stderr.write(result.stderr)

const output = result.stdout || ''
const match = output.match(/Total findings:\s*(\d+)/)
const findings = match ? Number(match[1]) : 0

if (findings > 0) {
  console.error(`Runtime enforcement failed: ${findings} architecture finding(s) detected.`)
  process.exit(1)
}

console.log('Runtime enforcement passed.')
