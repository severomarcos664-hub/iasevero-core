import { NextResponse } from 'next/server'
import { runRuntimeMasterOrchestrator } from '@/app/lib/runtime-core/runtime-master-orchestrator'

export async function GET() {
  const runtime = runRuntimeMasterOrchestrator()

  return NextResponse.json({
    ok: true,
    service: 'IASevero Runtime Status API',
    version: 'v14.5',
    runtime,
  })
}
