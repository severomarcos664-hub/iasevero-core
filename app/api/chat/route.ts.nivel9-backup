/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { iaseveroCore } from "@/app/lib/iasevero-core"
import { saveMemory, getMemory } from "@/app/lib/memory"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    const text =
      body?.message ||
      body?.text ||
      body?.input ||
      ""

    const user = String(body?.user || "default")

    const rawHistory = getMemory(user) || []

    // 🔥 só pega mensagens do usuário
    const history = rawHistory
      .map((m: { message: string }) => String(m.message || ""))
      .filter((m: string) => m.startsWith("USER:"))
      .slice(-5)

    const result = iaseveroCore(text, history)

    // salva só entrada limpa
    saveMemory(user, "USER: " + text)

    return NextResponse.json({
      success: true,
      intent: result.intent,
      reply: result.reply,
      memory: history
    })

  } catch {
    return NextResponse.json({
      success: false,
      error: "Erro IASevero"
    }, { status: 500 })
  }
}
