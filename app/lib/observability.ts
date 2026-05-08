export type IASeveroEvent = {
  event: string
  intent?: string
  provider?: string
  mode?: string
  durationMs?: number
  safe?: boolean
}

export function logEvent(data: IASeveroEvent) {
  const payload = {
    ts: new Date().toISOString(),
    service: 'IASevero',
    ...data
  }

  console.log(JSON.stringify(payload))
}
