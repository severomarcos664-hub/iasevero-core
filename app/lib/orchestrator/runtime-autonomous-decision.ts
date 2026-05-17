import {
  RuntimeCoordinationReport
} from './runtime-coordinator'

export type RuntimeAutonomousDecision = {
  action:
    | 'maintain'
    | 'recover'
    | 'audit'
    | 'stabilize'

  reason: string
  priority:
    | 'low'
    | 'medium'
    | 'high'

  createdAt: string
}

export function createAutonomousDecision(
  report: RuntimeCoordinationReport
): RuntimeAutonomousDecision {

  if (report.failedEvents >= 5) {

    return {
      action: 'recover',
      reason: 'Falhas elevadas detectadas.',
      priority: 'high',
      createdAt: new Date().toISOString()
    }
  }

  if (report.failedEvents >= 1) {

    return {
      action: 'audit',
      reason: 'Falhas moderadas detectadas.',
      priority: 'medium',
      createdAt: new Date().toISOString()
    }
  }

  return {
    action: 'maintain',
    reason: 'Runtime operacional estável.',
    priority: 'low',
    createdAt: new Date().toISOString()
  }
}
