type DecisionRecord = {
  timestamp: string
  intent: string
  provider: string
  safe: boolean
  reason: string
}

const history: DecisionRecord[] = []

export function rememberDecision(
  record: DecisionRecord
) {
  history.push(record)

  if (history.length > 100) {
    history.shift()
  }

  return record
}

export function getRecentDecisions() {
  return history.slice(-20)
}

export function clearDecisionMemory() {
  history.length = 0
}
