import { NextResponse } from "next/server"
import { getJob } from "@/app/lib/queue"
import { tickJobs } from "@/app/lib/runner"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  tickJobs()

  return NextResponse.json({
    ok: true,
    job: id ? getJob(id) || null : null
  })
}
