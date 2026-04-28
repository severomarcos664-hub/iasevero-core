export type ExecutionItem = {
  cmd: string
  output: string
}

const SAFE_COMMANDS = [
  "rm -rf .next",
  "npm run build",
  "npm run dev"
]

export function simulateCommand(cmd: string): ExecutionItem {
  if (!SAFE_COMMANDS.includes(cmd)) {
    return {
      cmd,
      output: "Bloqueado por segurança: comando fora da whitelist."
    }
  }

  return {
    cmd,
    output: "Simulação segura: " + cmd
  }
}

export function readLogs(): string {
  return "Logs analisados em modo seguro: nenhum erro crítico detectado."
}
