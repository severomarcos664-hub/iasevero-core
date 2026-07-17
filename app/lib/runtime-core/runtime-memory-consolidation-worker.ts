import type {
  EnterpriseMemoryEventRecord,
  EnterpriseMemoryType,
  RuntimeEnterpriseCognitiveMemoryRepository,
} from './runtime-enterprise-cognitive-memory-repository'

import {
  evaluateGovernedMemoryWrite,
  type GovernedMemoryWriteDecision,
} from './runtime-governed-memory-write-gate'

export type MemoryConsolidationMode =
  | 'episodic'
  | 'semantic'
  | 'procedural'

export type MemoryConsolidationInput = {
  tenantId: string
  userId: string
  executionKey: string
  mode: MemoryConsolidationMode
  afterSequence?: number
  limit?: number
  sourceAuthority?: number
  confidence?: number
}

export type MemoryConsolidationProposal = {
  proposalId: string
  mode: MemoryConsolidationMode
  memoryType: EnterpriseMemoryType
  eventIds: string[]
  firstSequence: number
  lastSequence: number
  content: string
  structuredPayload: Record<string, unknown>
  sourceAuthority: number
  confidence: number
  reasoning: string[]
}

export type MemoryConsolidationReport = {
  source: 'runtime-memory-consolidation-worker'
  tenantId: string
  userId: string
  executionKey: string
  mode: MemoryConsolidationMode
  eventCount: number
  proposalCount: number
  proposals: MemoryConsolidationProposal[]
  writeDecisions: GovernedMemoryWriteDecision[]
  reasoning: string[]
}

function assertNonEmpty(
  value: string,
  field: string,
): string {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(
      `${field} must be a non-empty string.`,
    )
  }

  return normalized
}

function clampScore(value: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  )
}

function readPayloadText(
  event: EnterpriseMemoryEventRecord,
): string {
  const preferredKeys = [
    'message',
    'decision',
    'action',
    'result',
    'error',
    'feedback',
    'policy',
    'content',
    'summary',
  ]

  for (const key of preferredKeys) {
    const value = event.payload[key]

    if (
      typeof value === 'string' &&
      value.trim()
    ) {
      return value.trim()
    }
  }

  return JSON.stringify(event.payload)
}

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function deduplicateEventTexts(
  events: EnterpriseMemoryEventRecord[],
): Array<{
  event: EnterpriseMemoryEventRecord
  text: string
}> {
  const seen = new Set<string>()
  const results: Array<{
    event: EnterpriseMemoryEventRecord
    text: string
  }> = []

  for (const event of events) {
    const text = readPayloadText(event)
    const normalized = normalizeText(text)

    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)

    results.push({
      event,
      text,
    })
  }

  return results
}

function buildEpisodicProposal(
  events: EnterpriseMemoryEventRecord[],
  sourceAuthority: number,
  confidence: number,
): MemoryConsolidationProposal | undefined {
  const uniqueEvents = deduplicateEventTexts(events)

  if (uniqueEvents.length < 2) {
    return undefined
  }

  const first = uniqueEvents[0]?.event
  const last =
    uniqueEvents[uniqueEvents.length - 1]?.event

  if (!first || !last) {
    return undefined
  }

  const timeline = uniqueEvents.map(
    ({ event, text }) =>
      `${event.eventType}: ${text}`,
  )

  return {
    proposalId:
      `episodic:${first.eventId}:${last.eventId}`,
    mode: 'episodic',
    memoryType: 'episodic',
    eventIds: uniqueEvents.map(
      ({ event }) => event.eventId,
    ),
    firstSequence: first.sequence,
    lastSequence: last.sequence,
    content:
      `Episódio operacional da execução: ${timeline.join(
        ' | ',
      )}`,
    structuredPayload: {
      eventCount: uniqueEvents.length,
      timeline,
      eventTypes: uniqueEvents.map(
        ({ event }) => event.eventType,
      ),
    },
    sourceAuthority,
    confidence,
    reasoning: [
      `${uniqueEvents.length} eventos distintos foram agrupados.`,
      'A ordem temporal original foi preservada.',
      'A proposta permanece sujeita ao Memory Write Gate.',
    ],
  }
}

function buildSemanticProposal(
  events: EnterpriseMemoryEventRecord[],
  sourceAuthority: number,
  confidence: number,
): MemoryConsolidationProposal | undefined {
  const semanticEvents = events.filter(
    (event) =>
      event.eventType === 'message' ||
      event.eventType === 'feedback' ||
      event.eventType === 'policy-change',
  )

  const uniqueEvents =
    deduplicateEventTexts(semanticEvents)

  if (uniqueEvents.length < 1) {
    return undefined
  }

  const first = uniqueEvents[0]?.event
  const last =
    uniqueEvents[uniqueEvents.length - 1]?.event

  if (!first || !last) {
    return undefined
  }

  const claims = uniqueEvents.map(
    ({ text }) => text,
  )

  return {
    proposalId:
      `semantic:${first.eventId}:${last.eventId}`,
    mode: 'semantic',
    memoryType: 'semantic',
    eventIds: uniqueEvents.map(
      ({ event }) => event.eventId,
    ),
    firstSequence: first.sequence,
    lastSequence: last.sequence,
    content:
      claims.length === 1
        ? claims[0]
        : `Conhecimento consolidado: ${claims.join(
            ' | ',
          )}`,
    structuredPayload: {
      claims,
      claimCount: claims.length,
      evidenceEventIds: uniqueEvents.map(
        ({ event }) => event.eventId,
      ),
    },
    sourceAuthority,
    confidence,
    reasoning: [
      'Eventos declarativos foram convertidos em proposta semântica.',
      'As evidências originais permaneceram vinculadas.',
      'A proposta permanece sujeita ao Memory Write Gate.',
    ],
  }
}

function buildProceduralProposal(
  events: EnterpriseMemoryEventRecord[],
  sourceAuthority: number,
  confidence: number,
): MemoryConsolidationProposal | undefined {
  const executionEvents = events.filter(
    (event) =>
      event.eventType === 'execution' ||
      event.eventType === 'result',
  )

  const uniqueEvents =
    deduplicateEventTexts(executionEvents)

  const executionCount = executionEvents.filter(
    (event) => event.eventType === 'execution',
  ).length

  const resultCount = executionEvents.filter(
    (event) => event.eventType === 'result',
  ).length

  if (
    uniqueEvents.length < 2 ||
    executionCount < 1 ||
    resultCount < 1
  ) {
    return undefined
  }

  const first = uniqueEvents[0]?.event
  const last =
    uniqueEvents[uniqueEvents.length - 1]?.event

  if (!first || !last) {
    return undefined
  }

  const steps = uniqueEvents.map(
    ({ event, text }) => ({
      eventType: event.eventType,
      text,
      sequence: event.sequence,
    }),
  )

  return {
    proposalId:
      `procedural:${first.eventId}:${last.eventId}`,
    mode: 'procedural',
    memoryType: 'procedural',
    eventIds: uniqueEvents.map(
      ({ event }) => event.eventId,
    ),
    firstSequence: first.sequence,
    lastSequence: last.sequence,
    content:
      `Procedimento observado: ${steps
        .map(
          (step) =>
            `${step.eventType}: ${step.text}`,
        )
        .join(' → ')}`,
    structuredPayload: {
      steps,
      executionCount,
      resultCount,
      evidenceEventIds: uniqueEvents.map(
        ({ event }) => event.eventId,
      ),
    },
    sourceAuthority,
    confidence,
    reasoning: [
      'Eventos de execução e resultado foram associados.',
      'A ordem dos passos foi preservada.',
      'O procedimento permanece candidato até aprovação governada.',
    ],
  }
}

function buildProposal(
  mode: MemoryConsolidationMode,
  events: EnterpriseMemoryEventRecord[],
  sourceAuthority: number,
  confidence: number,
): MemoryConsolidationProposal | undefined {
  switch (mode) {
    case 'episodic':
      return buildEpisodicProposal(
        events,
        sourceAuthority,
        confidence,
      )

    case 'semantic':
      return buildSemanticProposal(
        events,
        sourceAuthority,
        confidence,
      )

    case 'procedural':
      return buildProceduralProposal(
        events,
        sourceAuthority,
        confidence,
      )
  }
}

export function runMemoryConsolidationWorker(
  repository: RuntimeEnterpriseCognitiveMemoryRepository,
  input: MemoryConsolidationInput,
): MemoryConsolidationReport {
  const tenantId = assertNonEmpty(
    input.tenantId,
    'tenantId',
  )

  const userId = assertNonEmpty(
    input.userId,
    'userId',
  )

  const executionKey = assertNonEmpty(
    input.executionKey,
    'executionKey',
  )

  const sourceAuthority = clampScore(
    input.sourceAuthority ?? 75,
  )

  const confidence = clampScore(
    input.confidence ?? 70,
  )

  const events = repository.readEvents({
    tenantId,
    userId,
    executionKey,
    ...(input.afterSequence !== undefined
      ? {
          afterSequence:
            input.afterSequence,
        }
      : {}),
    limit: input.limit ?? 200,
  })

  const proposal = buildProposal(
    input.mode,
    events,
    sourceAuthority,
    confidence,
  )

  const governedProposal = proposal
    ? {
        ...proposal,
        structuredPayload: {
          ...proposal.structuredPayload,
          consolidationProvenance: {
            manifestVersion: 1,
            manifestId: [
              'consolidation',
              input.mode,
              ...proposal.eventIds,
            ].join(':'),
            mode: input.mode,
            sourceEventIds: [...proposal.eventIds],
            sourceEventCount: proposal.eventIds.length,
            firstSequence: proposal.firstSequence,
            lastSequence: proposal.lastSequence,
            sourceAuthority:
              proposal.sourceAuthority,
            confidence: proposal.confidence,
            reversible: true,
            requestedActivation: false,
            supersessionApplied: false,
          },
        },
      }
    : undefined

  const proposals = governedProposal
    ? [governedProposal]
    : []

  const writeDecisions = proposals.map(
    (candidate) =>
      evaluateGovernedMemoryWrite(
        repository,
        {
          tenantId,
          userId,
          executionKey,
          type: candidate.memoryType,
          content: candidate.content,
          structuredPayload:
            candidate.structuredPayload,
          source:
            'runtime-memory-consolidation-worker',
          sourceEventIds:
            candidate.eventIds,
          sourceAuthority:
            candidate.sourceAuthority,
          confidence:
            candidate.confidence,
          requestedActivation: false,
          retentionPolicy:
            'consolidated-memory-retention',
          policyTags: [
            'consolidated',
            candidate.mode,
          ],
        },
      ),
  )

  return {
    source:
      'runtime-memory-consolidation-worker',
    tenantId,
    userId,
    executionKey,
    mode: input.mode,
    eventCount: events.length,
    proposalCount: proposals.length,
    proposals,
    writeDecisions,
    reasoning: [
      `eventCount=${events.length}`,
      `proposalCount=${proposals.length}`,
      `mode=${input.mode}`,
      'The worker proposes memory without bypassing the governed Memory Write Gate.',
    ],
  }
}
