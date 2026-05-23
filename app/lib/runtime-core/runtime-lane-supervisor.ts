import { readRuntimeQueue } from './runtime-queue-manager'

export type RuntimeLaneHealth =
  | 'healthy'
  | 'busy'
  | 'congested'
  | 'critical'

export type RuntimeLaneSupervisorReport = {
  generatedAt: string
  source: 'runtime-lane-supervisor'
  totalQueued: number
  criticalLaneItems: number
  highPriorityItems: number
  normalPriorityItems: number
  lowPriorityItems: number
  laneHealth: RuntimeLaneHealth
  throttlingRecommended: boolean
  isolationRecommended: boolean
  recommendation: string
  reasoning: string[]
}

export function superviseRuntimeLanes():
RuntimeLaneSupervisorReport {

  const queue = readRuntimeQueue()

  const criticalLaneItems =
    queue.filter(item => item.priority === 'critical').length

  const highPriorityItems =
    queue.filter(item => item.priority === 'high').length

  const normalPriorityItems =
    queue.filter(item => item.priority === 'normal').length

  const lowPriorityItems =
    queue.filter(item => item.priority === 'low').length

  const totalQueued = queue.length

  const laneHealth: RuntimeLaneHealth =
    criticalLaneItems > 3
      ? 'critical'
      : totalQueued > 20
        ? 'congested'
        : totalQueued > 10
          ? 'busy'
          : 'healthy'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-lane-supervisor',

    totalQueued,
    criticalLaneItems,
    highPriorityItems,
    normalPriorityItems,
    lowPriorityItems,

    laneHealth,

    throttlingRecommended:
      laneHealth === 'busy' ||
      laneHealth === 'congested' ||
      laneHealth === 'critical',

    isolationRecommended:
      laneHealth === 'critical',

    recommendation:
      laneHealth === 'critical'
        ? 'Isolamento operacional recomendado para lane crítica.'
        : laneHealth === 'congested'
          ? 'Throttling recomendado para reduzir pressão nas lanes.'
          : laneHealth === 'busy'
            ? 'Monitoramento ampliado recomendado.'
            : 'Lanes operacionais saudáveis.',

    reasoning: [
      `queued:${totalQueued}`,
      `critical:${criticalLaneItems}`,
      `high:${highPriorityItems}`,
      `normal:${normalPriorityItems}`,
      `low:${lowPriorityItems}`,
      `laneHealth:${laneHealth}`,
    ],
  }
}
