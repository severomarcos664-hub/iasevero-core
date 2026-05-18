export type RuntimeFlowTask = {
  id: string
  type: string
  priority: number
  createdAt: number
}

export class RuntimeFlowController {
  private activeTasks = new Map<string, RuntimeFlowTask>()

  register(task: RuntimeFlowTask) {
    this.activeTasks.set(task.id, task)
  }

  release(taskId: string) {
    this.activeTasks.delete(taskId)
  }

  getSnapshot() {
    return {
      active: this.activeTasks.size,
      tasks: Array.from(this.activeTasks.values())
    }
  }

  hasTask(taskId: string) {
    return this.activeTasks.has(taskId)
  }
}

export const runtimeFlowController =
  new RuntimeFlowController()
