import { NextResponse } from 'next/server'
import { iaseveroCore } from '@/app/lib/iasevero-core'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message || ''
    const userId = body.userId || 'local'

    const result = await iaseveroCore(message, userId)

    return NextResponse.json({
      reply: result.reply,
      job: result.job || null
    })
  } catch {
    return NextResponse.json({
      reply: 'Erro interno controlado.',
      job: null
    })
  }
}
