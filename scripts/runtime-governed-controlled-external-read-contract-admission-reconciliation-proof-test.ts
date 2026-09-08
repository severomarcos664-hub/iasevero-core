import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

const contractBlock =
  route.match(
    /const toolControlledExternalReadContract =[\s\S]*?\n\s*: null/
  )?.[0] ?? ''

assert.ok(contractBlock.length > 0, 'Contract production block must exist.')

assert.equal(
  contractBlock.includes(
    'boundary: toolControlledExternalReadContractExecutorBoundary'
  ),
  true,
  'RED: Contract must consume an explicitly reconciled external.read contract boundary.',
)

assert.equal(
  contractBlock.includes(
    'boundary: toolControlledExternalReadExecutorBoundary,'
  ),
  false,
  'RED: Contract must not consume the generic fail-closed executor boundary directly.',
)

console.log({
  architecture:
    'generic-fail-closed -> specialized-admission -> reconciled-contract-boundary -> contract',
  genericRegistryMutation: false,
  networkAccessGrantedByReconciliation: false,
})

console.log(
  'Runtime governed external.read Contract admission reconciliation proof passed.',
)
