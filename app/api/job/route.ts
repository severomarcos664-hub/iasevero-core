import { NextResponse } from 'next/server'
import { getJob } from '@/app/lib/queue'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  return NextResponse.json({
    job: id ? getJob(id) || null : null
  })
}
