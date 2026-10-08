import assert from 'node:assert/strict'

import { composeGovernedFirstLaunch } from '../app/lib/runtime-execution-plane/runtime-first-launch-composition'
import { prepareFirstLaunchPostSpawnReadiness } from '../app/lib/runtime-execution-plane/runtime-first-launch-post-spawn-readiness'
import { integrateFirstLaunchReadinessObservation } from '../app/lib/runtime-execution-plane/runtime-first-launch-readiness-observation-integration'
import { createVerifiedProcessIncarnationReadinessHandoff } from '../app/lib/runtime-execution-plane/runtime-verified-process-incarnation-readiness-handoff'
import type { GovernedProcessSpawner } from '../app/lib/runtime-execution-plane/runtime-process-materialization'
import { createGovernedReleaseRuntimeIdentity } from '../app/lib/runtime-release-identity/runtime-release-identity'
import { createGovernedRuntimeInstanceIdentity } from '../app/lib/runtime-instance-identity/runtime-instance-identity'
import { createGovernedPersistentProcessManifest } from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'
import { evaluateGovernedProcessLaunchAuthorization } from '../app/lib/runtime-execution-plane/runtime-process-launch-authorization'

async function main() {
  let spawnCalls = 0

  const controlledSpawner: GovernedProcessSpawner = async () => {
    spawnCalls += 1
    return { pid: 424242 }
  }

  const releaseIdentity = createGovernedReleaseRuntimeIdentity({
    releaseIdentity: 'matrix-first-launch-release',
    sourceCommit: 'a'.repeat(64),
    sourceTag: 'matrix-first-launch',
    artifactSha256: 'b'.repeat(64),
    attestationSha256: 'c'.repeat(64),
    contentAddress: `sha256:${'b'.repeat(64)}`,
    signerKeyId: 'matrix-proof-signer',
    provenanceVerified: true,
    attestationVerified: true,
    signatureVerified: true,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  })

  const instanceIdentity = createGovernedRuntimeInstanceIdentity({
    releaseIdentity,
    instanceId: 'matrix-first-launch',
    startedAt: '2026-10-05T00:00:00.000Z',
  })

  const manifest = createGovernedPersistentProcessManifest({
    instanceIdentity,
    host: '127.0.0.1',
    port: 3000,
    executable: 'node',
    entrypoint: 'node_modules/next/dist/bin/next',
    arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
  })

  const authorization = evaluateGovernedProcessLaunchAuthorization({
    manifest,
    launchAuthorizationGranted: true,
    authorizationRecordId: 'matrix-first-launch-auth',
  })

  const result = await composeGovernedFirstLaunch(
    { manifest, authorization },
    controlledSpawner,
  )

  assert.equal(spawnCalls, 1)
  assert.equal(result.materialization.processStarted, true)
  assert.equal(result.materialization.processId, 424242)
  const readinessCandidate = prepareFirstLaunchPostSpawnReadiness(result)

  const verificationHandoff =
    createVerifiedProcessIncarnationReadinessHandoff({
      verification: {
        schemaVersion: 1,
        kind: 'iasevero-controlled-process-incarnation-verification-decision',
        processId: readinessCandidate.processId,
        bootId: 'fixture-first-launch-boot-id',
        processStartTicks: 424242001,
        verificationEvaluated: true,
        identityMatched: true,
        processIncarnationEvidenceRecorded: true,
        processIncarnationVerified: true,
        readinessGranted: false,
        livenessGranted: false,
        runtimeAuthorityGranted: false,
        networkAuthorityGranted: false,
      },
      candidate: readinessCandidate,
    })

  const observationIntegration =
    integrateFirstLaunchReadinessObservation({
      candidate: readinessCandidate,
      verificationHandoff,
      probe: {
        observedProcessId: 424242,
        observedHost: '127.0.0.1',
        observedPort: 3000,
        transportReachable: true,
        applicationResponsive: true,
      },
    })

  assert.equal(
    observationIntegration.readinessObservationIntegrated,
    true,
  )

  assert.equal(observationIntegration.evidence.processId, 424242)
  assert.equal(
    observationIntegration.evidence.transportReachable,
    true,
  )
  assert.equal(
    observationIntegration.evidence.applicationResponsive,
    true,
  )
  assert.equal(
    observationIntegration.evidence.readinessGranted,
    false,
  )
  assert.equal(
    observationIntegration.evidence.livenessGranted,
    false,
  )
  assert.equal(
    observationIntegration.evidence.runtimeAuthorityGranted,
    false,
  )
  assert.equal(
    observationIntegration.evidence.networkAuthorityGranted,
    false,
  )

  assert.equal(observationIntegration.assessment.processId, 424242)
  assert.equal(
    observationIntegration.assessment.readinessCriteriaSatisfied,
    true,
  )
  assert.equal(
    observationIntegration.assessment.readinessGranted,
    false,
  )
  assert.equal(
    observationIntegration.assessment.livenessGranted,
    false,
  )
  assert.equal(
    observationIntegration.assessment.runtimeAuthorityGranted,
    false,
  )
  assert.equal(
    observationIntegration.assessment.networkAuthorityGranted,
    false,
  )

  console.log('CONTROLLED_READINESS_OBSERVATION=TRUE')
  console.log('READINESS_EVIDENCE_RECORDED=TRUE')
  console.log('READINESS_ASSESSMENT_COMPLETED=TRUE')
  console.log('READINESS_CRITERIA_SATISFIED=TRUE')
  console.log('READINESS_GRANTED=FALSE')
  console.log('LIVENESS_GRANTED=FALSE')
  console.log('REAL_HEALTH_OBSERVATION=FALSE')
  console.log('FIRST_LAUNCH_READINESS_OBSERVATION_FUNCTIONAL=PROVED')
  assert.equal(readinessCandidate.processId, 424242)
  assert.equal(readinessCandidate.processIdentityVerified, true)
  assert.equal(readinessCandidate.readinessEvaluationEligible, true)
  assert.equal(readinessCandidate.readinessGranted, false)
  assert.equal(readinessCandidate.livenessGranted, false)
  assert.equal(readinessCandidate.runtimeAuthorityGranted, false)
  assert.equal(readinessCandidate.networkAuthorityGranted, false)
  console.log('POST_SPAWN_FUNCTIONAL_BOUNDARY=PROVED')
  console.log('DIRECT_HEALTH_GRANT=FALSE')
  console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')

  assert.equal(result.identityBinding.processIdentityBound, true)
  assert.equal(result.persistentLaunch.persistentLaunchPrepared, true)
  assert.equal(result.persistentLaunch.processSpawnedByBoundary, false)
  assert.equal(result.persistentLaunch.runtimeAuthorityGranted, false)
  assert.equal(result.persistentLaunch.networkAuthorityGranted, false)

  console.log('CONTROLLED_SPAWN_CALLS=1')
  console.log('CONTROLLED_PROCESS_ID=424242')
  console.log('PROCESS_IDENTITY_BOUND=TRUE')
  console.log('PERSISTENT_LAUNCH_PREPARED=TRUE')
  console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
  console.log('FIRST_LAUNCH_COMPOSITION=PROVED')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
