import { queue, runNextStep } from './queue'
import { runSafeCommand } from './executor'

export function tickJobs() {
  Object.values(queue).forEach((job) => {
    if (job.status !== 'done') {
      runNextStep(job, runSafeCommand)
    }
  })
}
