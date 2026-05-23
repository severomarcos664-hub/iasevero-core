export type RuntimePolicyInput = {
  userId: string
  message: string
  operationalState: string
  governance: string
}

export type RuntimePolicyReport = {
  allowed: boolean
  reason: string
  severity: 'low' | 'medium' | 'high'
}

const userRuntimeMap: Record<
  string,
  { count: number; timestamp: number }
> = {}

export function enforceRuntimePolicy(
  input: RuntimePolicyInput,
): RuntimePolicyReport {

  const now = Date.now()

  const current =
    userRuntimeMap[input.userId] || {
      count: 0,
      timestamp: now,
    }

  if (now - current.timestamp < 1000) {
    current.count++
  } else {
    current.count = 1
    current.timestamp = now
  }

  userRuntimeMap[input.userId] = current

  if (current.count > 10) {
    return {
      allowed: false,
      reason: 'runtime flood protection activated',
      severity: 'high',
    }
  }

  if (input.message.length > 4000) {
    return {
      allowed: false,
      reason: 'payload exceeds runtime limit',
      severity: 'medium',
    }
  }

  if (input.governance !== 'NORMAL_OPERATION') {
    return {
      allowed: false,
      reason: 'runtime governance restriction',
      severity: 'high',
    }
  }

  return {
    allowed: true,
    reason: 'runtime policy approved',
    severity: 'low',
  }
}
