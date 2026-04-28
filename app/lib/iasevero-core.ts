import { simulateCommand, readLogs } from './tools-exec'

export type Intent =
  | "diagnostico"
  | "infra"
  | "custo"
  | "seguranca"
  | "deploy"
  | "identidade"
  | "geral"

type ExecutionItem = {
  cmd: string
  output: string
}

export type IASeveroResult = {
  intent: Intent
  reply: string
  commands: string[]
  execution: ExecutionItem[]
  validation: {
    passed: boolean
    issues: string[]
  }
}

function classifyIntent(msg: string): Intent {
  const t = msg.toLowerCase()

  if (t.includes("erro")) return "infra"
  if (t.includes("custo")) return "custo"
  if (t.includes("token")) return "seguranca"
  if (t.includes("deploy")) return "deploy"
  if (t.includes("quem te criou")) return "identidade"

  return "geral"
}

export function iaseveroCore(message: string, memory: string[] = []): IASeveroResult {
  try {
    if (!message || message.length < 2) {
      return {
        intent: "geral",
        reply: "Entrada inválida.",
        commands: [],
        execution: [],
        validation: { passed: true, issues: [] }
      }
    }

    const intent = classifyIntent(message)

    let commands: string[] = []
    let reply = "IASevero analisando: " + message

    if (intent === "infra") {
      commands = ["rm -rf .next", "npm run build", "npm run dev"]

      const logs = readLogs()

      reply =
        "Diagnóstico: erro de infraestrutura detectado.\n" +
        logs
    }

    const execution = commands.map(simulateCommand)

    return {
      intent,
      reply,
      commands,
      execution,
      validation: { passed: true, issues: [] }
    }

  } catch (error) {
    return {
      intent: "geral",
      reply: "Erro interno controlado.",
      commands: [],
      execution: [],
      validation: { passed: false, issues: ["erro interno"] }
    }
  }
}
