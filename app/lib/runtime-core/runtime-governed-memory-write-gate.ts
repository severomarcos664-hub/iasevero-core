import type {
  CreateEnterpriseCognitiveMemoryInput,
  EnterpriseCognitiveMemoryRecord,
  EnterpriseMemoryStatus,
  RuntimeEnterpriseCognitiveMemoryRepository,
} from './runtime-enterprise-cognitive-memory-repository'

export type MemorySensitivity =
  | 'public'
  | 'internal'
  | 'confidential'
  | 'restricted'

export type GovernedMemoryWriteInput =
  CreateEnterpriseCognitiveMemoryInput & {
    allowSensitiveMemory?: boolean
    requestedActivation?: boolean
  }

export type GovernedMemoryWriteDecision = {
  source: 'runtime-governed-memory-write-gate'
  writeAllowed: boolean
  decision: 'accepted' | 'rejected'
  targetStatus: EnterpriseMemoryStatus | 'rejected'
  sensitivity: MemorySensitivity
  retentionPolicy: string
  duplicateDetected: boolean
  duplicateMemoryId?: string
  duplicateSimilarity: number
  memory?: EnterpriseCognitiveMemoryRecord
  reasoning: string[]
}

const SECRET_PATTERNS: readonly RegExp[] = [
  /\bpassword\b/i,
  /\bsenha\b/i,
  /\bsecret\b/i,
  /\bsegredo\b/i,
  /\bprivate[\s_-]?key\b/i,
  /\bchave[\s_-]?privada\b/i,
  /\bapi[\s_-]?key\b/i,
  /\baccess[\s_-]?token\b/i,
  /\bbearer\s+[a-z0-9._-]+/i,
  /\bseed[\s_-]?phrase\b/i,
  /\bmnemonic\b/i,
]

const CONFIDENTIAL_PATTERNS: readonly RegExp[] = [
  /\bcpf\b/i,
  /\brg\b/i,
  /\bcnh\b/i,
  /\bpassport\b/i,
  /\bpassaporte\b/i,
  /\baccount number\b/i,
  /\bnúmero da conta\b/i,
  /\bmedical\b/i,
  /\bmédic[oa]\b/i,
  /\bdiagn[oó]stico\b/i,
]

function normalizeContent(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string): Set<string> {
  return new Set(
    normalizeContent(value)
      .split(' ')
      .filter((token) => token.length >= 3),
  )
}

function calculateJaccardSimilarity(
  left: string,
  right: string,
): number {
  const leftTokens = tokenize(left)
  const rightTokens = tokenize(right)

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0
  }

  let intersection = 0

  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      intersection += 1
    }
  }

  const union =
    leftTokens.size + rightTokens.size - intersection

  if (union === 0) {
    return 0
  }

  return Math.round((intersection / union) * 100)
}

function classifySensitivity(
  content: string,
  policyTags: readonly string[],
): MemorySensitivity {
  const normalizedTags = policyTags.map((tag) =>
    tag.trim().toLowerCase(),
  )

  if (
    normalizedTags.includes('restricted') ||
    SECRET_PATTERNS.some((pattern) => pattern.test(content))
  ) {
    return 'restricted'
  }

  if (
    normalizedTags.includes('confidential') ||
    CONFIDENTIAL_PATTERNS.some((pattern) =>
      pattern.test(content),
    )
  ) {
    return 'confidential'
  }

  if (
    normalizedTags.includes('internal') ||
    normalizedTags.includes('operational')
  ) {
    return 'internal'
  }

  return 'public'
}

function resolveRetentionPolicy(
  sensitivity: MemorySensitivity,
  requestedPolicy?: string,
): string {
  const normalized = requestedPolicy?.trim()

  if (normalized) {
    return normalized
  }

  switch (sensitivity) {
    case 'restricted':
      return 'restricted-short-retention'

    case 'confidential':
      return 'confidential-controlled-retention'

    case 'internal':
      return 'internal-standard-retention'

    case 'public':
      return 'standard'
  }
}

function resolveTargetStatus(input: {
  requestedActivation: boolean
  confidence: number
  sourceAuthority: number
  sensitivity: MemorySensitivity
}): EnterpriseMemoryStatus {
  if (
    input.requestedActivation &&
    input.confidence >= 80 &&
    input.sourceAuthority >= 70 &&
    input.sensitivity !== 'restricted'
  ) {
    return 'active'
  }

  return 'candidate'
}

export function evaluateGovernedMemoryWrite(
  repository: RuntimeEnterpriseCognitiveMemoryRepository,
  input: GovernedMemoryWriteInput,
): GovernedMemoryWriteDecision {
  const content = input.content.trim()
  const policyTags = input.policyTags ?? []
  const reasoning: string[] = []

  if (!content) {
    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity: 'public',
      retentionPolicy: 'none',
      duplicateDetected: false,
      duplicateSimilarity: 0,
      reasoning: ['Memory content is empty.'],
    }
  }

  if (content.length < 12) {
    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity: 'public',
      retentionPolicy: 'none',
      duplicateDetected: false,
      duplicateSimilarity: 0,
      reasoning: [
        'Memory content is too short to justify durable storage.',
      ],
    }
  }

  const sensitivity = classifySensitivity(
    content,
    policyTags,
  )

  const retentionPolicy = resolveRetentionPolicy(
    sensitivity,
    input.retentionPolicy,
  )

  reasoning.push(`Sensitivity classified as ${sensitivity}.`)
  reasoning.push(
    `Retention policy resolved as ${retentionPolicy}.`,
  )

  if (
    sensitivity === 'restricted' &&
    input.allowSensitiveMemory !== true
  ) {
    reasoning.push(
      'Restricted memory requires explicit authorization.',
    )

    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity,
      retentionPolicy,
      duplicateDetected: false,
      duplicateSimilarity: 0,
      reasoning,
    }
  }

  if (input.confidence < 30) {
    reasoning.push(
      'Memory confidence is below the minimum write threshold.',
    )

    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity,
      retentionPolicy,
      duplicateDetected: false,
      duplicateSimilarity: 0,
      reasoning,
    }
  }

  if (input.sourceAuthority < 20) {
    reasoning.push(
      'Source authority is below the minimum write threshold.',
    )

    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity,
      retentionPolicy,
      duplicateDetected: false,
      duplicateSimilarity: 0,
      reasoning,
    }
  }

  const activeMemories = repository.readActiveMemories({
    tenantId: input.tenantId,
    userId: input.userId,
    types: [input.type],
    limit: 200,
    ...(input.entityId
      ? { entityId: input.entityId }
      : {}),
  })

  let duplicateMemory:
    | EnterpriseCognitiveMemoryRecord
    | undefined

  let highestSimilarity = 0
  const normalizedCandidate = normalizeContent(content)

  for (const memory of activeMemories) {
    const normalizedExisting = normalizeContent(
      memory.content,
    )

    const similarity =
      normalizedExisting === normalizedCandidate
        ? 100
        : calculateJaccardSimilarity(
            memory.content,
            content,
          )

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity
      duplicateMemory = memory
    }
  }

  if (duplicateMemory && highestSimilarity >= 92) {
    reasoning.push(
      `Duplicate memory detected with similarity ${highestSimilarity}.`,
    )

    return {
      source: 'runtime-governed-memory-write-gate',
      writeAllowed: false,
      decision: 'rejected',
      targetStatus: 'rejected',
      sensitivity,
      retentionPolicy,
      duplicateDetected: true,
      duplicateMemoryId: duplicateMemory.memoryId,
      duplicateSimilarity: highestSimilarity,
      reasoning,
    }
  }

  if (duplicateMemory && highestSimilarity >= 70) {
    reasoning.push(
      `Related memory detected with similarity ${highestSimilarity}; candidate review required.`,
    )
  } else {
    reasoning.push('No blocking duplicate was detected.')
  }

  const requestedActivation =
    input.requestedActivation === true

  const targetStatus = resolveTargetStatus({
    requestedActivation,
    confidence: input.confidence,
    sourceAuthority: input.sourceAuthority,
    sensitivity,
  })

  if (
    requestedActivation &&
    targetStatus !== 'active'
  ) {
    reasoning.push(
      'Requested activation was downgraded to candidate by governance thresholds.',
    )
  }

  if (targetStatus === 'active') {
    reasoning.push(
      'Memory meets authority, confidence and sensitivity requirements for activation.',
    )
  } else {
    reasoning.push(
      'Memory was accepted as candidate pending stronger evidence or governance approval.',
    )
  }

  const memory = repository.createMemory({
    ...(input.memoryId
      ? { memoryId: input.memoryId }
      : {}),
    tenantId: input.tenantId,
    userId: input.userId,
    ...(input.entityId
      ? { entityId: input.entityId }
      : {}),
    ...(input.executionKey
      ? { executionKey: input.executionKey }
      : {}),
    type: input.type,
    content,
    structuredPayload:
      input.structuredPayload ?? {},
    source: input.source,
    sourceEventIds:
      input.sourceEventIds ?? [],
    sourceAuthority: input.sourceAuthority,
    confidence: input.confidence,
    ...(input.observedAt
      ? { observedAt: input.observedAt }
      : {}),
    ...(input.validFrom
      ? { validFrom: input.validFrom }
      : {}),
    ...(input.validUntil
      ? { validUntil: input.validUntil }
      : {}),
    status: targetStatus,
    retentionPolicy,
    policyTags,
    ...(input.supersedesMemoryId
      ? {
          supersedesMemoryId:
            input.supersedesMemoryId,
        }
      : {}),
  })

  return {
    source: 'runtime-governed-memory-write-gate',
    writeAllowed: true,
    decision: 'accepted',
    targetStatus,
    sensitivity,
    retentionPolicy,
    duplicateDetected:
      highestSimilarity >= 70,
    ...(duplicateMemory
      ? {
          duplicateMemoryId:
            duplicateMemory.memoryId,
        }
      : {}),
    duplicateSimilarity: highestSimilarity,
    memory,
    reasoning,
  }
}
