export type RuntimeIncidentSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'

export type RuntimeIncident = {
  id: string
  timestamp: string
  severity: RuntimeIncidentSeverity
  source: string
  message: string
}

let runtimeIncidents: RuntimeIncident[] = []

export function registerRuntimeIncident(
  severity: RuntimeIncidentSeverity,
  source: string,
  message: string
): RuntimeIncident {

  const incident: RuntimeIncident = {
    id:
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `incident-${Date.now()}`,
    timestamp: new Date().toISOString(),
    severity,
    source,
    message
  }

  runtimeIncidents = [
    incident,
    ...runtimeIncidents
  ].slice(0, 100)

  return incident
}

export function getRuntimeIncidents(): RuntimeIncident[] {
  return runtimeIncidents
}
