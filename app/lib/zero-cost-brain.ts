
export function localIntelligence(message: string, context: string): string {
  const msg = message.toLowerCase()

  let analysis = ""

  if (msg.includes("erro")) {
    analysis = "Erro detectado. Próximo passo: limpar build, validar logs e testar novamente."
  } else if (msg.includes("custo")) {
    analysis = "Controle de custo ativo. Priorize execução local e reduza chamadas externas."
  } else if (msg.includes("api")) {
    analysis = "API operacional. Endpoint /api/chat deve responder normalmente."
  } else {
    analysis = "Sistema ativo e estável."
  }

  return `🧠 IASevero

📩 Entrada:
${message}

⚙️ Análise:
${analysis}

🚀 Status: ativo`
}
