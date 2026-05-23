import { NextResponse } from 'next/server'
import { iaseveroCore } from '@/app/lib/iasevero-core'

import { executeRuntimeDecisionEngine } from '@/app/lib/orchestrator/runtime-decision-engine'
import { superviseRuntime } from '@/app/lib/orchestrator/runtime-supervisor'
import { persistRuntimeSnapshot } from '@/app/lib/orchestrator/runtime-snapshot'
import { runRuntimeExecutionBridge } from '@/app/lib/runtime-core/runtime-execution-bridge'
import { createRuntimeTraceNode } from '@/app/lib/runtime-core/runtime-distributed-trace-engine'
import { evaluateRuntimeDecisionGate } from '@/app/lib/runtime-core/runtime-decision-gate'
import { evaluateRuntimeActionPolicy } from '@/app/lib/runtime-core/runtime-action-policy-engine'

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

    const runtimeDecision = executeRuntimeDecisionEngine()
    const runtimeState = superviseRuntime()
    const runtimeSnapshot = persistRuntimeSnapshot()
    const decisionGate = evaluateRuntimeDecisionGate(message, userId)
const actionPolicy = evaluateRuntimeActionPolicy()

    if (!decisionGate.allowed) {
      return NextResponse.json({
        reply: 'Execução pausada pelo Runtime Decision Gate. O sistema recomenda estabilização antes de continuar.',
        job: null,
        runtime: decisionGate,
      })
    }

    if (!actionPolicy.allowExecution) {
      return NextResponse.json({
        reply: 'Execução bloqueada pela Runtime Action Policy.',
        job: null,
        runtime: actionPolicy,
      })
    }

    const runtimeMaster = runRuntimeExecutionBridge(message, userId)

    const traceRequest = createRuntimeTraceNode(
      'chat.request.received',
      null,
      'ok',
      {
        userId,
        correlationId: runtimeMaster.correlationId,
        messageLength: message.length,
      },
    )

    const traceRuntime = createRuntimeTraceNode(
      'chat.runtime.evaluated',
      traceRequest.id,
      runtimeMaster.executionAllowed ? 'ok' : 'warning',
      {
        operationalState: runtimeMaster.operationalState,
        governance: runtimeMaster.governance.decision,
        integrity: runtimeMaster.integrity.integrity,
        healing: runtimeMaster.healing.decision,
        recovery: runtimeMaster.recovery.operationalState,
      },
    )

    const result = await iaseveroCore(message, userId)

    const traceResponse = createRuntimeTraceNode(
      'chat.response.generated',
      traceRuntime.id,
      'ok',
      {
        hasJob: Boolean(result.job),
        replyLength: result.reply.length,
      },
    )

    return NextResponse.json({
      reply: result.reply,
      job: result.job || null,
      runtime: {
        operationalState: runtimeMaster.operationalState,
        governance: runtimeMaster.governance.decision,
        integrity: runtimeMaster.integrity.integrity,
        healing: runtimeMaster.healing.decision,
        recovery: runtimeMaster.recovery.operationalState,
        correlationId: runtimeMaster.correlationId,
        executionAllowed: runtimeMaster.executionAllowed,
        traceId: traceResponse.id,
      }
    })

  } catch (e) {
    return NextResponse.json({
      reply: 'Erro interno controlado.',
      job: null
    })
  }
}
