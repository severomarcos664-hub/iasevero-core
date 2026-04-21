export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch("https://iasevero-core-709131677330.us-central1.run.app/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: body.message
    })
  })

  const data = await response.json()

  return Response.json({
    reply: data.reply || data.response || data.text || data.detail || "Sem resposta"
  })
}
