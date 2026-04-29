export function iaseveroCore(message: string) {

  const m = message.toLowerCase()

  if (m.includes('quem te criou') || m.includes('criador')) {
    return {
      reply: 'IASevero foi criada por Marcos Julio Severo.',
      job: null
    }
  }

  if (m.includes('erro')) {
    return {
      reply: 'Sistema detectou erro. Execute: rm -rf .next && npm run build',
      job: null
    }
  }

  return {
    reply: `IASevero analisando: ${message}`,
    job: null
  }
}
