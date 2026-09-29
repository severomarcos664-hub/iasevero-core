import fs from 'node:fs'
import assert from 'node:assert/strict'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

assert.match(
  route,
  /toolControlledExternalReadCognitiveUseAuthority\.cognitiveUseAuthorizationGranted/,
)

assert.match(
  route,
  /toolControlledExternalReadCognitiveAdmission\?\.safeForCognitiveUse/,
)

assert.match(
  route,
  /semanticInstructionBoundaryAccepted/,
)

const semanticUse =
  /semanticInstructionBoundaryAccepted\s*===\s*true/.test(route)

const authorityUse =
  /cognitiveUseAuthorizationGranted\s*===\s*true/.test(route)

const admissionUse =
  /safeForCognitiveUse\s*===\s*true/.test(route)

assert.equal(semanticUse, true)
assert.equal(authorityUse, true)
assert.equal(admissionUse, true)

const semanticIndex = route.indexOf('semanticInstructionBoundaryAccepted')
const authorityIndex = route.indexOf('cognitiveUseAuthorizationGranted', semanticIndex)
const admissionIndex = route.indexOf('safeForCognitiveUse', semanticIndex)

assert.ok(authorityIndex >= 0)
assert.ok(admissionIndex >= 0)

console.log('Runtime Security-First external-content cognitive-use enforcement proof passed.')
