import { NextResponse } from 'next/server'

import { runRuntimeMasterOrchestrator }
from '@/app/lib/runtime-core/runtime-master-orchestrator'

export async function GET() {
  const runtime = runRuntimeMasterOrchestrator()

  return NextResponse.json({
    ok: true,
    source: 'runtime-live-telemetry',
    generatedAt: new Date().toISOString(),

    telemetry: {
      operationalState:
        runtime.operationalState,

      governance:
        runtime.governance.decision,

      integrity:
        runtime.integrity.integrity,

      recovery:
        runtime.recovery.operationalState,

      predictiveRisk:
        "low",

      selfHealing:
        runtime.governance.reasoning,

      recommendation:
        runtime.recommendation,
    },
  })
}
