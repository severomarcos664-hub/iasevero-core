export type RuntimePriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'NORMAL'
  | 'LOW'

export interface RuntimePriorityAction {
  id: string
  type: string
  priority: RuntimePriority
}

export function sortRuntimeActionsByPriority(
  actions: RuntimePriorityAction[]
) {
  const priorityWeight: Record<RuntimePriority, number> = {
    CRITICAL: 0,
    HIGH: 1,
    NORMAL: 2,
    LOW: 3
  }

  return [...actions].sort((a, b) => {
    return (
      priorityWeight[a.priority] -
      priorityWeight[b.priority]
    )
  })
}
