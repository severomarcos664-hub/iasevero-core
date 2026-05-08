export type IASeveroIntent =
  | 'shell'
  | 'diagnostic'
  | 'memory'
  | 'cost'
  | 'general'

export function resolvePriority(intent: IASeveroIntent) {
  const priorities = {
    shell: 100,
    diagnostic: 90,
    memory: 80,
    cost: 70,
    general: 10
  }

  return priorities[intent] || 0
}

export function shouldBlockExternal(intent: IASeveroIntent) {
  return ['shell', 'diagnostic', 'cost'].includes(intent)
}
