export type PolicyResult = {
  allowed: boolean
  risk: 'low' | 'medium' | 'high'
  reason: string
}

const BLOCKED_PATTERNS = [
  'rm -rf',
  'shutdown',
  'reboot',
  'mkfs',
  'dd if=',
  'format c:',
  ':(){:|:&};:',
]

export function evaluatePolicy(message: string): PolicyResult {
  const input = message.toLowerCase()

  for (const pattern of BLOCKED_PATTERNS) {
    if (input.includes(pattern)) {
      return {
        allowed: false,
        risk: 'high',
        reason: `Comando bloqueado pela policy: ${pattern}`
      }
    }
  }

  if (
    input.includes('delete') ||
    input.includes('deletar') ||
    input.includes('apagar')
  ) {
    return {
      allowed: true,
      risk: 'medium',
      reason: 'Ação destrutiva detectada; exigir confirmação.'
    }
  }

  return {
    allowed: true,
    risk: 'low',
    reason: 'Policy aprovada.'
  }
}
