export type RuntimeGovernedCodeProposalInput = {
  missionId: string
  proposalId: string
  objective: string
  targetFile: string
  proposedContent: string
  modelId: string
}

export type RuntimeGovernedCodeProposal = {
  schemaVersion: 1
  kind: 'iasevero-governed-code-proposal'
  missionId: string
  proposalId: string
  objective: string
  targetFile: string
  proposedContent: string
  modelId: string
  allowedEnvironment: 'sandbox-only'
  generatedCodeUntrusted: true
  proposalPrepared: true
  providerInvocation: false
  sandboxExecutionApplied: false
  executionApplied: false
  mutationApplied: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

const MAX_IDENTIFIER_LENGTH = 128
const MAX_OBJECTIVE_LENGTH = 4096
const MAX_TARGET_PATH_LENGTH = 512
const MAX_CODE_LENGTH = 262144

function requireText(
  value: string,
  name: string,
  maxLength: number,
  preserveExact = false
): string {
  if (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    value.length > maxLength ||
    (!preserveExact && /[\u0000-\u001f\u007f]/u.test(value))
  ) {
    throw new Error(`Invalid governed code proposal field: ${name}.`)
  }

  return preserveExact ? value : value.trim()
}

function requireSafeRelativePath(value: string): string {
  const path = requireText(
    value,
    'targetFile',
    MAX_TARGET_PATH_LENGTH
  )

  if (
    path.startsWith('/') ||
    path.startsWith('~') ||
    path.includes('\\') ||
    path.includes(':') ||
    /[<>|?*]/u.test(path) ||
    path.split('/').some(
      segment =>
        segment === '' ||
        segment === '.' ||
        segment === '..'
    )
  ) {
    throw new Error('Governed code proposal requires safe relative path.')
  }

  return path
}

export function createRuntimeGovernedCodeProposal(
  input: RuntimeGovernedCodeProposalInput
): RuntimeGovernedCodeProposal {
  const missionId = requireText(
    input.missionId, 'missionId', MAX_IDENTIFIER_LENGTH
  )

  const proposalId = requireText(
    input.proposalId, 'proposalId', MAX_IDENTIFIER_LENGTH
  )

  const objective = requireText(
    input.objective, 'objective', MAX_OBJECTIVE_LENGTH
  )

  const targetFile = requireSafeRelativePath(input.targetFile)

  const proposedContent = requireText(
    input.proposedContent,
    'proposedContent',
    MAX_CODE_LENGTH,
    true
  )

  const modelId = requireText(
    input.modelId, 'modelId', MAX_IDENTIFIER_LENGTH
  )

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-code-proposal',
    missionId,
    proposalId,
    objective,
    targetFile,
    proposedContent,
    modelId,
    allowedEnvironment: 'sandbox-only',
    generatedCodeUntrusted: true,
    proposalPrepared: true,
    providerInvocation: false,
    sandboxExecutionApplied: false,
    executionApplied: false,
    mutationApplied: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
