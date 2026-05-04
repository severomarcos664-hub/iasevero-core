
export function localIntelligence(message: string, context: string): string {
  const msg = message.toLowerCase()

  const isErro = ["erro", "bug", "falha", "falhou", "quebrou", "failed", "fail"].some(k => msg.includes(k))
  const isCusto = ["custo", "gasto", "caro", "api cara"].some(k => msg.includes(k))
  const isApi = ["api", "endpoint", "requisição"].some(k => msg.includes(k))

  let analysis = ""

  if (isErro) {
    analysis = "Erro detectado. Próximo passo: limpar build, validar logs e testar novamente."
  } else if (isCusto) {
    analysis = "Controle de custo ativo. Priorize execução local e reduza chamadas externas."
  } else if (isApi) {
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
