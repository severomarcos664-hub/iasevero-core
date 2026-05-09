type RuntimeTask = {
  id: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

const queue: RuntimeTask[] = []

export function addTask(task: RuntimeTask) {
  queue.push(task)

  queue.sort((a, b) => {
    const levels = {
      high: 3,
      medium: 2,
      low: 1
    }

    return levels[b.priority] - levels[a.priority]
  })

  return queue
}

export function getQueue() {
  return queue
}

export function clearQueue() {
  queue.length = 0
}
