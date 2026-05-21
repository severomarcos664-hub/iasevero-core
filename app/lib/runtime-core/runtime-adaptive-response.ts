import { evaluateRuntimeCognitiveState } from './runtime-cognitive-state'

export type RuntimeAdaptiveResponse = {
  generatedAt: string
  source: 'runtime-adaptive-response'
  action:
    | 'operate-normally'
    | 'increase-observation'
    | 'reduce-pressure'
    | 'enter-containment'
    | 'isolate-runtime'
  providerMode: 'local' | 'hybrid' | 'openai'
  memoryMode: 'protected' | 'session' | 'persistent'
  requestPolicy: 'normal' | 'throttled' | 'blocked'
  cooldownMs: number
  reason: string
  reasoning: string[]
}

export function evaluateRuntimeAdaptiveResponse(): RuntimeAdaptiveResponse {
  const state = evaluateRuntimeCognitiveState()

  if (state.cognitiveState === 'critical') {
    return {
      generatedAt: new Date().toISOString(),
      source: 'runtime-adaptive-response',
      action: 'isolate-runtime',
      providerMode: 'local',
      memoryMode: 'protected',
      requestPolicy: 'blocked',
      cooldownMs: 30000,
      reason: 'Estado cognitivo crítico exige isolamento operacional.',
      reasoning: state.reasoning,
    }
  }

  if (state.cognitiveState === 'overloaded') {
    return {
      generatedAt: new Date().toISOString(),
      source: 'runtime-adaptive-response',
      action: 'enter-containment',
      providerMode: 'local',
      memoryMode: 'protected',
      requestPolicy: 'throttled',
      cooldownMs: 15000,
      reason: 'Estado sobrecarregado exige contenção e redução de pressão.',
      reasoning: state.reasoning,
    }
  }

  if (state.cognitiveState === 'degrading') {
    return {
      generatedAt: new Date().toISOString(),
      source: 'runtime-adaptive-response',
      action: 'reduce-pressure',
      providerMode: 'hybrid',
      memoryMode: 'protected',
      requestPolicy: 'throttled',
      cooldownMs: 5000,
      reason: 'Degradação operacional detectada; reduzir pressão.',
      reasoning: state.reasoning,
    }
  }

  if (state.cognitiveState === 'focused') {
    return {
      generatedAt: new Date().toISOString(),
      source: 'runtime-adaptive-response',
      action: 'operate-normally',
      providerMode: 'hybrid',
      memoryMode: 'persistent',
      requestPolicy: 'normal',
      cooldownMs: 0,
      reason: 'Estado focado permite operação supervisionada normal.',
      reasoning: state.reasoning,
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-adaptive-response',
    action: 'increase-observation',
    providerMode: 'hybrid',
    memoryMode: 'session',
    requestPolicy: 'normal',
    cooldownMs: 0,
    reason: 'Estado estável com observação contínua.',
    reasoning: state.reasoning,
  }
}
