export type RuntimeTransactionStatus =
  | 'created'
  | 'validated'
  | 'committed'
  | 'rolled_back'
  | 'rejected'

export type RuntimeTransaction = {
  id: string
  scope: string
  action: string
  status: RuntimeTransactionStatus
  createdAt: string
}

export function createRuntimeTransaction(
  scope: string,
  action: string
): RuntimeTransaction {
  return {
    id: `rtx_${Date.now()}`,
    scope,
    action,
    status: 'created',
    createdAt: new Date().toISOString()
  }
}

export function validateRuntimeTransaction(
  transaction: RuntimeTransaction
): RuntimeTransaction {
  if (!transaction.scope || !transaction.action) {
    return { ...transaction, status: 'rejected' }
  }

  return { ...transaction, status: 'validated' }
}

export function commitRuntimeTransaction(
  transaction: RuntimeTransaction
): RuntimeTransaction {
  if (transaction.status !== 'validated') {
    return { ...transaction, status: 'rejected' }
  }

  return { ...transaction, status: 'committed' }
}

export function rollbackRuntimeTransaction(
  transaction: RuntimeTransaction
): RuntimeTransaction {
  return { ...transaction, status: 'rolled_back' }
}
