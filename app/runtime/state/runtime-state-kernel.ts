export type RuntimeStateAccessMode =
  | 'read'
  | 'write'
  | 'transition'
  | 'snapshot'

export type RuntimeStateScope =
  | 'kernel'
  | 'governance'
  | 'execution'
  | 'observability'
  | 'intelligence'
  | 'autonomy'
  | 'validation'

export function canMutateRuntimeState(scope: RuntimeStateScope): boolean {
  return scope === 'kernel'
}

export function canReadRuntimeState(scope: RuntimeStateScope): boolean {
  return [
    'kernel',
    'governance',
    'observability',
    'intelligence',
    'validation'
  ].includes(scope)
}

export function validateRuntimeStateAccess(
  scope: RuntimeStateScope,
  mode: RuntimeStateAccessMode
) {
  if (mode === 'read') {
    return canReadRuntimeState(scope)
  }

  if (mode === 'write' || mode === 'transition' || mode === 'snapshot') {
    return canMutateRuntimeState(scope)
  }

  return false
}
