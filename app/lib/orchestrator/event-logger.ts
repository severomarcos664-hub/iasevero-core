import { IASeveroEvent } from './events'

const memory: IASeveroEvent[] = []

export function logEvent(event: IASeveroEvent) {
  memory.push(event)

  if (memory.length > 1000) {
    memory.shift()
  }

  console.log(
    '[IASevero Event]',
    JSON.stringify(event)
  )
}

export function getRecentEvents() {
  return memory.slice(-20)
}
