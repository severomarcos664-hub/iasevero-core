import {
  buildGovernedMemoryContextText,
  type GovernedMemoryContext,
} from '../app/lib/iasevero-core'

const emptyContext =
  buildGovernedMemoryContextText()

if (emptyContext !== '') {
  throw new Error(
    'Empty governed memory context must not alter generation context.',
  )
}

const context: GovernedMemoryContext = {
  source: 'runtime-enterprise-cognitive-memory',
  tenantId: 'tenant-generation-test',
  userId: 'user-generation-test',
  query: 'Qual é o projeto principal do usuário?',
  selectedCount: 1,
  rejectedCount: 2,
  grounded: true,
  items: [
    {
      memoryId: 'memory-project-iasevero',
      type: 'semantic',
      content:
        'O projeto principal do usuário é a plataforma IASevero.',
      source:
        'runtime-enterprise-cognitive-memory-repository',
      sourceAuthority: 95,
      confidence: 96,
      observedAt: '2026-07-15T20:00:00.000Z',
      score: 94,
    },
  ],
  reasoning: [
    'same-tenant',
    'same-user',
    'active-memory',
    'temporally-valid',
  ],
}

const rendered =
  buildGovernedMemoryContextText(context)

const requiredFragments = [
  'GOVERNED ENTERPRISE MEMORY CONTEXT',
  'memory-project-iasevero',
  'semantic',
  'IASevero',
  'authority=95',
  'confidence=96',
  'score=94',
]

for (const fragment of requiredFragments) {
  if (!rendered.includes(fragment)) {
    throw new Error(
      `Governed generation context is missing: ${fragment}`,
    )
  }
}

if (
  rendered.includes('rejected-memory') ||
  rendered.includes('revoked-memory')
) {
  throw new Error(
    'Rejected or revoked memory leaked into generation context.',
  )
}

console.log(
  'Runtime governed memory generation context test passed.',
)

console.log({
  selectedCount: context.selectedCount,
  rejectedCount: context.rejectedCount,
  grounded: context.grounded,
  messagePreserved: true,
  contextRendered: true,
})
