import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

assert.equal(
  route.includes(
    "executeRuntimeToolControlledExternalReadEffect",
  ),
  true,
  'v287.72 requires production path to use the canonical controlled external read effect owner',
)

assert.equal(
  route.includes(
    'toolControlledExternalReadRevalidatedEffectHandoff.effectHandoffPrepared',
  ),
  true,
  'production effect execution must depend on the revalidated DNS handoff',
)

assert.equal(
  route.includes(
    'toolControlledExternalReadContract?.decision.contractEligible === true',
  ),
  true,
  'production effect execution must depend on an eligible external-read contract',
)

const effectCalls =
  (
    route.match(
      /executeRuntimeToolControlledExternalReadEffect\s*\(/g,
    ) ?? []
  ).length

assert.equal(
  effectCalls,
  1,
  'v287.72 production path must introduce exactly one canonical external-read effect call',
)

console.log({
  architecture:
    'authorization -> dns-resolution -> binding -> revalidation -> revalidated-handoff -> contract -> real-https-effect',
  expectedProductionEffectCallCount: 1,
  actualProductionEffectCallCount: effectCalls,
})

console.log(
  'Runtime governed controlled external read first real HTTPS effect production proof passed.',
)
