export function validateQuality(reply: string, commands: string[]) {
  const issues: string[] = []

  if (!reply || reply.length < 20) {
    issues.push("resposta muito curta")
  }

  if (reply.toLowerCase().includes("não sei")) {
    issues.push("resposta fraca")
  }

  if (reply.toLowerCase().includes("erro") && commands.length === 0) {
    issues.push("diagnóstico sem ação prática")
  }

  return {
    passed: issues.length === 0,
    issues,
  }
}

export function improveReply(reply: string, commands: string[]) {
  if (commands.length > 0) {
    return reply + "\n\nValidação IASevero: resposta contém ação prática sugerida."
  }

  return reply + "\n\nValidação IASevero: resposta segura, sem comando necessário."
}
