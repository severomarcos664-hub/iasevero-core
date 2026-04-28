import { execSync } from "child_process"

const SAFE_COMMANDS = [
  "rm -rf .next",
  "ls",
  "pwd"
]

export function runSafeCommand(cmd: string): string {
  if (cmd === "npm run build") {
    return "Execução manual recomendada: build não roda dentro do chat para evitar lentidão."
  }

  if (cmd === "npm run dev") {
    return "Bloqueado por segurança: servidor já deve estar rodando."
  }

  if (!SAFE_COMMANDS.includes(cmd)) {
    return "Bloqueado por segurança."
  }

  try {
    const output = execSync(cmd, { encoding: "utf-8", timeout: 2000 })
    return output.trim() || "Executado com sucesso."
  } catch (e) {
    return "Execução falhou de forma controlada."
  }
}
