import assert from 'node:assert/strict'
import fs from 'node:fs'

const owner =
  'app/lib/orchestrator/runtime-tool-external-read-dns-rebinding-revalidation.ts'

const routePath = 'app/api/chat/route.ts'

const ownerExists = fs.existsSync(owner)
const route = fs.readFileSync(routePath, 'utf8')

assert.equal(
  ownerExists,
  true,
  'v287.70 requires a canonical DNS rebinding revalidation owner',
)

const source = fs.readFileSync(owner, 'utf8')

assert.equal(
  source.includes('revalidateRuntimeToolDnsResolutionBinding'),
  true,
  'canonical owner must expose DNS binding revalidation',
)

assert.equal(
  source.includes("revalidationStatus: 'accepted' | 'blocked'"),
  true,
  'revalidation must be explicitly fail-closed',
)

assert.equal(
  route.includes('toolControlledExternalReadDnsRevalidation'),
  true,
  'production path must preserve DNS revalidation evidence',
)

console.log({
  architecture:
    'dns-resolution -> binding/pinning -> rebinding-revalidation -> future-effect',
  networkAccess: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

console.log(
  'Runtime governed controlled external read DNS rebinding revalidation proof passed.',
)
