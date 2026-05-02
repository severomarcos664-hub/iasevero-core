export function fallbackLocal(text: string): string | null {
  const t = text.toLowerCase()

  // IDENTIDADE
  if (t.includes('quem te criou') || t.includes('seu criador')) {
    return 'IASevero foi criada por Marcos Julio Severo.'
  }

  // CONCEITOS
  if (t.includes('humildade')) {
    return 'Humildade é reconhecer limites, aprender constantemente e respeitar os outros.'
  }

  // TECNOLOGIA
  if (t.includes('ia') || t.includes('inteligencia')) {
    return 'IASevero é um sistema de inteligência artificial em evolução com arquitetura híbrida.'
  }

  // CUSTO
  if (t.includes('custo') || t.includes('gastar')) {
    return 'Modo atual: custo zero. Evitando uso de APIs externas.'
  }

  // SEGURANÇA
  if (t.includes('token') || t.includes('chave')) {
    return 'Nunca exponha tokens ou chaves. Segurança é prioridade máxima.'
  }

  // DEPLOY
  if (t.includes('deploy')) {
    return 'Faça deploy apenas com build validado e segurança verificada.'
  }

  // ERRO
  if (t.includes('erro')) {
    return 'Erro detectado. Verifique logs e execute limpeza de build.'
  }

  // VENDAS / PRODUTO
  if (t.includes('vender') || t.includes('ganhar dinheiro')) {
    return 'IASevero pode ser usada como assistente inteligente para negócios e automação.'
  }

  return null
}
