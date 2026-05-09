export type IASeveroState = {
  mode: string
  lastIntent?: string
  lastProvider?: string
  lastRisk?: string
  safe: boolean
  updatedAt: string
}

let runtimeState: IASeveroState = {
  mode: 'local',
  safe: true,
  updatedAt: new Date().toISOString()
}

export function getState(): IASeveroState {
  return runtimeState
}

export function updateState(
  data: Partial<IASeveroState>
): IASeveroState {
  runtimeState = {
    ...runtimeState,
    ...data,
    updatedAt: new Date().toISOString()
  }

  return runtimeState
}

export function resetState(): IASeveroState {
  runtimeState = {
    mode: 'local',
    safe: true,
    updatedAt: new Date().toISOString()
  }

  return runtimeState
}
