import { NextResponse } from "next/server"
import { iaseveroCore } from "@/app/lib/iasevero-core"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message || ""

    const result = iaseveroCore(message)

    let finalReply = result.reply

    if (result.commands && result.commands.length > 0) {
      finalReply += "\n\nComandos sugeridos:\n"
      result.commands.forEach((cmd: string, i: number) => {
        finalReply += `${i + 1}. ${cmd}\n`
      })
    }

    if (result.execution && result.execution.length > 0) {
      finalReply += "\nExecução simulada:\n"
      result.execution.forEach((item: any, i: number) => {
        finalReply += `${i + 1}. ${item.output}\n`
      })
    }

    return NextResponse.json({
      reply: finalReply,
      commands: result.commands || [],
      execution: result.execution || [],
      validation: result.validation || {}
    })
  } catch (error) {
    return NextResponse.json({
      reply: "Erro interno controlado."
    })
  }
}
