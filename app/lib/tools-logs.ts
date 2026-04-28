import { execSync } from "child_process"

export function readLogs(): string {
  try {
    const logs = execSync("ls -lh", { encoding: "utf-8" })
    return "Logs do sistema:\n" + logs.slice(0, 300)
  } catch {
    return "Erro ao ler logs."
  }
}
