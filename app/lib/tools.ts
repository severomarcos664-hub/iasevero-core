export function diagnosticCommands(intent: string) {
  if (intent === "infra") {
    return [
      "rm -rf .next",
      "npm run build",
      "npm run dev"
    ]
  }

  if (intent === "diagnostico") {
    return [
      "npm run dev",
      "verificar logs no terminal",
      "revisar ultima alteração"
    ]
  }

  if (intent === "custo") {
    return [
      "evitar deploy",
      "manter execução local",
      "não usar API externa"
    ]
  }

  return []
}
