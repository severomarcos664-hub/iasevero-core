import assert from 'node:assert/strict'
import { POST } from '../app/api/chat/route'

async function main(): Promise<void> {
  const request = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      message: 'v287.72 governed first real HTTPS production-path proof',
      externalReadTarget: {
        protocol: 'https:',
        host: 'www.iana.org',
        resource: '/help/example-domains',
        origin: 'user-explicit',
      },
    }),
  })

  const response = await POST(request)
  const body = await response.json()

  assert.equal(response.status, 200)

  assert.equal(
    body.toolControlledExternalReadRequestTarget?.requestTargetEligible,
    true,
  )

  assert.equal(
    body.toolControlledExternalReadPolicyAuthority?.policyAuthorized,
    true,
  )

  assert.equal(
    body.toolControlledExternalReadDnsBinding?.bindingStatus,
    'bound',
  )

  assert.equal(
    body.toolControlledExternalReadDnsRevalidation?.revalidationStatus,
    'accepted',
  )

  assert.equal(
    body.toolControlledExternalReadContract?.contractEligible,
    true,
  )

  const effect = body.toolControlledExternalReadEffect

  assert.ok(effect)
  assert.equal(effect.networkAttempted, true)
  assert.equal(effect.networkCompleted, true)
  assert.equal(effect.networkAccess, true)
  assert.equal(effect.responseReceived, true)
  assert.ok(effect.responseBytes > 0)
  assert.equal(effect.externalReadApplied, true)
  assert.equal(effect.executionApplied, true)

  assert.equal(effect.externalMutation, false)
  assert.equal(effect.mutationApplied, false)
  assert.equal(effect.providerInvocation, false)

  console.log({
    architecture:
      'api-chat -> governed-target -> policy -> dns -> binding -> revalidation -> contract -> pinned-https-effect',
    requestTargetEligible:
      body.toolControlledExternalReadRequestTarget?.requestTargetEligible,
    policyAuthorized:
      body.toolControlledExternalReadPolicyAuthority?.policyAuthorized,
    bindingStatus:
      body.toolControlledExternalReadDnsBinding?.bindingStatus,
    revalidationStatus:
      body.toolControlledExternalReadDnsRevalidation?.revalidationStatus,
    contractEligible:
      body.toolControlledExternalReadContract?.contractEligible,
    networkAttempted: effect.networkAttempted,
    networkCompleted: effect.networkCompleted,
    networkAccess: effect.networkAccess,
    httpsStatus: effect.httpsStatus,
    responseReceived: effect.responseReceived,
    responseBytes: effect.responseBytes,
    externalReadApplied: effect.externalReadApplied,
    executionApplied: effect.executionApplied,
    externalMutation: effect.externalMutation,
    mutationApplied: effect.mutationApplied,
    providerInvocation: effect.providerInvocation,
  })

  console.log(
    'Runtime governed controlled external read production-path REAL HTTPS proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
