import { NextResponse } from 'next/server'
import { iaseveroCore } from '@/app/lib/iasevero-core'

const MAX_TEXT_LENGTH = 4000

type RateLimitEntry = {
  count: number
  time: number
}

declare global {
  var __rateLimit: Record<string, RateLimitEntry>
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = (body.message || '').toString().trim()
    const userId = body.userId || 'local'

    if (!message) {
      return NextResponse.json({ reply: 'Mensagem vazia.', job: null })
    }

    if (message.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({
        reply: 'Mensagem muito longa. Limite: 4000 caracteres.',
        job: null
      })
    }

    const now = Date.now()
    global.__rateLimit = global.__rateLimit || {}

    const userData = global.__rateLimit[userId] || { count: 0, time: now }

    if (now - userData.time < 1000) {
      userData.count++
    } else {
      userData.count = 1
      userData.time = now
    }

    global.__rateLimit[userId] = userData

    if (userData.count > 5) {
      return NextResponse.json({
        reply: 'Muitas requisições. Aguarde um momento.',
        job: null
      })
    }

    const result = await iaseveroCore(message, userId)

    return NextResponse.json({
      reply: result.reply,
      job: result.job || null
    })

  } catch (e) {
    return NextResponse.json({
      reply: 'Erro interno controlado.',
      job: null
    })
  }
}
