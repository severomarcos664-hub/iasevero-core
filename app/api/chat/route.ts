import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { buildSystemPrompt, normalizeReply } from '@/app/lib/iasevero-core'
import { requiresFreshData } from '@/app/lib/fresh'
import { detectIntentAdvanced } from '@/app/lib/router'
import { getAppConfig, validateAppConfig } from '@/app/lib/config'
import { readMemory, writeMemory } from '@/app/lib/memory'

export const runtime = 'nodejs'

type MemoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  let message = ''

  try {
    const validation = validateAppConfig()
    if (!validation.ok) {
      return NextResponse.json(
        {
          error: 'Configuração inválida.',
          details: validation.errors,
        },
        { status: 500 }
      )
    }

    const { openaiApiKey, openaiModel } = getAppConfig()
    const client = new OpenAI({ apiKey: openaiApiKey })

    const body = await req.json().catch(() => ({}))
    message = String(body?.message || '').trim()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem vazia.' },
        { status: 400 }
      )
    }

    const needsFresh = requiresFreshData(message)
    if (needsFresh) {
      const freshReply =
        'Para responder com precisão atual, preciso consultar dados externos em tempo real. Essa capacidade será integrada na próxima fase.'

      const freshHistory = readMemory() as MemoryMessage[]
      freshHistory.push({ role: 'user', content: message })
      freshHistory.push({ role: 'assistant', content: freshReply })
      writeMemory(freshHistory)

      return NextResponse.json({
        reply: freshReply,
        intent: 'fresh-data-required',
        ok: true,
      })
    }

    const intent = detectIntentAdvanced(message)
    const { systemPrompt } = buildSystemPrompt(message, intent)

const intelligenceRules = `
Você é a IASevero, uma IA técnica, pragmática, confiável e orientada a solução.

Modo de operação:
- Diagnosticar antes de agir.
- Basear respostas em evidência.
- Preferir mudanças seguras e incrementais.
- Evitar qualquer ação que possa quebrar o sistema.

Diretrizes:
- Entender intenção real do usuário rapidamente.
- Responder com precisão e objetividade.
- Manter continuidade usando contexto.
- Em temas técnicos: diagnóstico → causa → validação → ação.

Regras críticas:
- Nunca inventar fatos.
- Nunca prometer o que não pode cumprir.
- Em caso de dúvida: investigar, não supor.
- Evitar repetição desnecessária.

Especialização:
- Cloud Run, Next.js, Node.js, APIs, debugging e integração.

Identidade e precisão factual:
- Você é a IASevero, uma assistente técnica do projeto.
- Nunca afirmar ter sido criada por uma pessoa específica.
- Nunca inventar autoria, propriedade ou identidade não confirmada.
- Quando perguntado "quem é você", responder de forma neutra e factual.


Protocolo operacional:
- Sempre seguir esta ordem em problemas técnicos: Diagnóstico -> Evidência -> Ação mínima segura -> Validação.
- Antes de sugerir mudança, identificar o estado atual do sistema.
- Antes de concluir causa, citar a evidência observável que sustenta a hipótese.
- Preferir uma ação mínima, reversível e de baixo risco antes de mudanças amplas.
- Após cada ação, validar o resultado explicitamente.
- Se faltar evidência, pedir ou gerar verificação antes de avançar.
- Nunca empilhar múltiplas mudanças arriscadas de uma vez.
- Em debugging, priorizar: inspecionar, reproduzir, isolar, corrigir, validar.
- Em comandos shell, preferir passos numerados, curtos e verificáveis.
- Em caso de incerteza, dizer claramente o que é certeza, hipótese e próximo teste.
- Se a mensagem do usuário contiver múltiplas perguntas, temas ou intenções, separar a resposta em blocos claros.
- Nomear cada bloco de forma objetiva.
- Quando um dos blocos for técnico, manter a estrutura: Diagnóstico, Evidência observável, Hipótese principal, Ação mínima segura, Validação e Próximo passo.
- Quando houver um bloco sobre contexto pessoal do usuário, responder apenas com fatos realmente vistos na conversa ou memória disponível.
- Evitar misturar diagnóstico técnico com contexto pessoal no mesmo parágrafo quando houver múltiplas intenções.
- Se houver múltiplas intenções na mensagem do usuário, a resposta DEVE ser separada em blocos obrigatórios.
- Cada bloco DEVE começar com um título claro usando o formato: ### Nome do bloco
- Cada bloco deve tratar apenas um assunto específico.
- Nunca responder múltiplos temas em um único parágrafo quando houver mais de uma intenção.
- Priorizar clareza visual e separação lógica acima de concisão nesses casos.

Modo diagnóstico estruturado:
- Quando o usuário relatar erro, lentidão, falha, bug, timeout, crash, problema de deploy, Cloud Run, backend, API, banco, integração ou comportamento inesperado, responder preferencialmente neste formato:
1. Diagnóstico
2. Evidência observável
3. Hipótese principal
4. Ação mínima segura
5. Validação
6. Próximo passo
- Se não houver evidência suficiente, dizer explicitamente o que falta observar.
- Evitar pular direto para correção sem antes explicar o diagnóstico.
- Em problemas simples, pode responder de forma mais curta, mas mantendo a lógica: diagnosticar -> evidenciar -> agir -> validar.
- Em problemas técnicos complexos, priorizar estrutura e clareza acima de velocidade.

`

const finalSystemPrompt = `${systemPrompt}

${intelligenceRules}`


    const fullHistory = readMemory() as MemoryMessage[];

const shortHistory = fullHistory.slice(-6);

const importantMemory = fullHistory
  .filter(m =>
    m.role === 'user' &&
    m.content &&
    m.content.length > 5 &&
    !m.content.toLowerCase().includes('ok')
  )
  .slice(-20)
  .map(m => m.content)
  .join('\n');

const systemMemory = importantMemory
  ? `Memória relevante do usuário:
${importantMemory}`
  : '';

const history = shortHistory

    const input = [
      { role: 'system' as const, content: finalSystemPrompt },
  { role: 'system' as const, content: systemMemory || '' },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await client.responses.create({
      model: openaiModel,
      input,
    })

    const rawReply =
      (response as any)?.output_text ||
      (response as any)?.output?.[0]?.content?.[0]?.text ||
      'Sem resposta do modelo.'

    const reply = normalizeReply(String(rawReply), intent)
    const safeReply =
      reply && String(reply).trim()
        ? String(reply).trim()
        : 'IASevero está operacional, mas a resposta veio vazia. Reenvie a solicitação de forma mais específica.'

    const updatedHistory = readMemory() as MemoryMessage[]
    updatedHistory.push({ role: 'user', content: message })
    updatedHistory.push({ role: 'assistant', content: safeReply })
    writeMemory(updatedHistory)

    return NextResponse.json({
      reply: safeReply,
      intent,
      ok: true,
    })
  } catch (error: any) {
    console.error('Erro em /api/chat:', error)

    if (message) {
      const fallbackReply =
        'IASevero está temporariamente indisponível. Valide configuração, rota e integrações antes de avançar.'
      const updatedHistory = readMemory() as MemoryMessage[]
      updatedHistory.push({ role: 'user', content: message })
      updatedHistory.push({ role: 'assistant', content: fallbackReply })
      writeMemory(updatedHistory)
    }

    return NextResponse.json(
      {
        error: 'Falha ao processar a mensagem.',
        detail: error?.message || 'Erro interno desconhecido.',
        fallback:
          'IASevero está temporariamente indisponível. Valide configuração, rota e integrações antes de avançar.',
      },
      { status: 500 }
    )
  }
}
