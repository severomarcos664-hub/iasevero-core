import { NextResponse } from 'next/server'
import { iaseveroCore } from '@/app/lib/iasevero-core'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message || ''

    const result = await iaseveroCore(message)

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
