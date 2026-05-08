export type IASeveroEvent = {
  type: string
  timestamp: string
  provider?: string
  risk?: string
  message?: string
  details?: string
}

export function createEvent(
  type: string,
  data: Partial<IASeveroEvent> = {}
): IASeveroEvent {
  return {
    type,
    timestamp: new Date().toISOString(),
    ...data
  }
}
