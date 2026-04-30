import { runProvider } from './provider'

export async function iaseveroCore(message: string, userId = 'local') {
  const reply = await runProvider(message)

  return {
    reply,
    job: null,
    userId
  }
}
