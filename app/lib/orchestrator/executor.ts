type ExecutionInput = {
  provider: string
  allowed: boolean
  reason: string
}

type ExecutionResult = {
  executed: boolean
  provider: string
  reason: string
}

export function executeRoute(
  input: ExecutionInput
): ExecutionResult {

  if (!input.allowed) {
    return {
      executed: false,
      provider: 'blocked',
      reason: input.reason
    }
  }

  return {
    executed: true,
    provider: input.provider,
    reason: input.reason
  }
}
