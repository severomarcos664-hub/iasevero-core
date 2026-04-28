export type Job = {
  id: string
  steps: string[]
  results: string[]
  status: 'pending' | 'running' | 'done'
}

export const queue: Record<string, Job> = {}

export function createJob(steps: string[]): Job {
  const id = 'job_' + Date.now()
  const job: Job = { id, steps, results: [], status: 'pending' }
  queue[id] = job
  return job
}

export function getJob(id: string): Job | undefined {
  return queue[id]
}

export function runNextStep(job: Job, exec: (cmd: string) => string) {
  if (job.steps.length === 0) {
    job.status = 'done'
    return
  }

  job.status = 'running'
  const step = job.steps.shift()!
  const result = exec(step)

  job.results.push(`[${step}] -> ${result}`)

  if (job.steps.length === 0) {
    job.status = 'done'
  }
}
