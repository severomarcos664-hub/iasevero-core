export function detectCommand(text: string): string | null {
  const t = (text || '').trim().toLowerCase()

  if (t === 'npm run dev') {
    return 'Comando detectado: npm run dev. Use esse comando no Shell para iniciar o servidor local de desenvolvimento.'
  }

  if (t === 'npm run build') {
    return 'Comando detectado: npm run build. Ele valida se o projeto compila corretamente antes de rodar ou publicar.'
  }

  if (t === 'rm -rf .next') {
    return 'Comando detectado: rm -rf .next. Ele limpa o build anterior do Next.js para evitar cache corrompido.'
  }

  if (t.includes('./security_check.sh')) {
    return 'Comando detectado: security_check. Ele verifica riscos básicos antes de avançar.'
  }

  if (t.includes('./verify_iasevero.sh')) {
    return 'Comando detectado: verify_iasevero. Ele valida se a estrutura principal da IASevero está íntegra.'
  }

  return null
}
