export type RuntimeToolExecution = {
  executor: string
  reason: string
}

export function dispatchRuntimeTool(stepId: string): RuntimeToolExecution {
  return {
    executor: 'runtime-execution-pipeline',
    reason: `Dispatcher selecionou executor para ${stepId}`
  }
}
