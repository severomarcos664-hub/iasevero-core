export type RuntimeArbitrationDecision =
  | 'allow'
  | 'delay'
  | 'deny'

export interface RuntimeArbitrationInput {
  id: string
  type: string
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'
  hasConflict?: boolean
}

export function arbitrateRuntimeAction(
  input: RuntimeArbitrationInput
): RuntimeArbitrationDecision {
  if (input.hasConflict) {
    return 'delay'
  }

  if (input.priority === 'CRITICAL') {
    return 'allow'
  }

  return 'allow'
}
