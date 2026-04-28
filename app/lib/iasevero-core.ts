import { runSafeCommand } from './executor'
import { createJob, runNextStep } from './queue'

export function iaseveroCore(message: string) {
  let steps: string[] = []

  if (message.includes('erro')) {
    steps = ['rm -rf .next', 'npm run build', 'npm run dev']
  }

  const job = createJob(steps)

  runNextStep(job, runSafeCommand)
  runNextStep(job, runSafeCommand)
  runNextStep(job, runSafeCommand)

  const details = job.results.length
    ? '\n\nResultados:\n' + job.results.map((r, i) => `${i + 1}. ${r}`).join('\n')
    : ''

  return {
    reply: `Job ${job.id} concluído com status: ${job.status}${details}`,
    job
  }
}
