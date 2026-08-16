import assert from 'node:assert/strict'

import {
  createRuntimeToolDnsResolverAdapter,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-resolver-adapter'

async function main() {
  let calls = 0

  const adapter = createRuntimeToolDnsResolverAdapter(async hostname => {
    calls += 1
    assert.equal(hostname, 'example.test')

    return [
      { address: '8.8.8.8', family: 4 },
      { address: '1.1.1.1', family: 4 },
    ]
  })

  assert.equal(adapter.adapterId, 'governed-external-read-dns-resolver')
  assert.equal(adapter.networkAccess, false)

  const result = await adapter.resolve('example.test')

  assert.equal(calls, 1)
  assert.deepEqual(result, [
    { address: '8.8.8.8', family: 4 },
    { address: '1.1.1.1', family: 4 },
  ])

  console.log('Runtime governed external-read DNS resolver adapter proof passed.')
  console.log({
    adapterId: adapter.adapterId,
    networkAccess: adapter.networkAccess,
    delegatedExactlyOnce: calls === 1,
    resolvedAddressCount: result.length,
    assertionCount: 5,
  })
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
