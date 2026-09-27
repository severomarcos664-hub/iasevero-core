import { readFileSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const appendCount =
  route.match(/memoryRepository\.appendEvent\(\{/g)?.length ?? 0

const importsGovernedWriteGate =
  route.includes('runtime-governed-memory-write-gate')

const consumesGovernedWriteDecision =
  route.includes('evaluateGovernedMemoryWrite(')

assert.equal(
  appendCount,
  2,
  'Expected exactly two production memory appendEvent calls',
)

assert.equal(
  importsGovernedWriteGate,
  true,
  'Production route must import the canonical governed memory write gate',
)

assert.equal(
  consumesGovernedWriteDecision,
  true,
  'Production route must consume the canonical governed memory write decision',
)

console.log(
  'V287_75_SECURITY_FIRST_PRODUCTION_MEMORY_WRITE_GATE_INTEGRATION_PROOF=PASS',
)
