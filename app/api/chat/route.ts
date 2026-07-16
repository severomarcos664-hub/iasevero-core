import { NextResponse } from 'next/server'
import {
  iaseveroCore,
  type GovernedMemoryContext,
} from '@/app/lib/iasevero-core'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '@/app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'
import {
  retrieveHybridEnterpriseMemories,
} from '@/app/lib/runtime-core/runtime-hybrid-memory-retrieval'

import { executeRuntimeDecisionEngine } from '@/app/lib/orchestrator/runtime-decision-engine'
import { superviseRuntime } from '@/app/lib/orchestrator/runtime-supervisor'
import { persistRuntimeSnapshot } from '@/app/lib/orchestrator/runtime-snapshot'
import { createRuntimeTraceNode } from '@/app/lib/runtime-core/runtime-distributed-trace-engine'
import { evaluateRuntimeDecisionGate } from '@/app/lib/runtime-core/runtime-decision-gate'
import { evaluateRuntimeResponseCase } from '@/app/lib/runtime-core/runtime-response-evaluation-baseline'
import { evaluateRuntimeActionPolicy } from '@/app/lib/runtime-core/runtime-action-policy-engine'

import { evaluateRuntimeConsciousnessIntegration } from '@/app/lib/runtime-consciousness-integration/runtime-consciousness-integration'
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
    const tenantId =
      typeof body.tenantId === 'string' &&
      body.tenantId.trim()
        ? body.tenantId.trim()
        : 'local'
    const requestedExecutionKey =
      typeof body.executionKey === 'string'
        ? body.executionKey.trim()
        : ''
    const effectiveExecutionKey =
      requestedExecutionKey || `${userId}:${message}`

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
    const decisionGate = evaluateRuntimeDecisionGate(
      message,
      userId,
      effectiveExecutionKey,
    )
const actionPolicy = evaluateRuntimeActionPolicy()
const consciousness = evaluateRuntimeConsciousnessIntegration()

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

    const runtimeMaster = decisionGate

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
      runtimeMaster.allowed ? 'ok' : 'warning',
      {
        operationalState: runtimeMaster.operationalState,
        governance: runtimeMaster.governance,
        integrity: runtimeMaster.integrity,
        healing: runtimeMaster.healing,
        recovery: runtimeMaster.recovery,
      },
    )

const cognitiveKernel = decisionGate.kernel
    const runtimePlan = cognitiveKernel.stages.planning
    const pipelineResult = cognitiveKernel.stages.execution
    const executiveAuthority = cognitiveKernel.stages.authority
    const executiveState = {
      executionAllowed: decisionGate.allowed,
      source: 'runtime-cognitive-kernel',
    }

    let governedMemoryContext:
      | GovernedMemoryContext
      | undefined

    const memoryDatabasePath =
      process.env.IASEVERO_MEMORY_DB_PATH ??
      'data/enterprise-cognitive-memory.sqlite'

    const memoryRepository =
      new RuntimeEnterpriseCognitiveMemoryRepository(
        memoryDatabasePath,
      )

    try {
      const memoryRetrieval =
        retrieveHybridEnterpriseMemories(
          memoryRepository,
          {
            tenantId,
            userId,
            query: message,
            limit: 6,
            candidateLimit: 100,
            minimumScore: 35,
          },
        )

      if (memoryRetrieval.results.length > 0) {
        governedMemoryContext = {
          source:
            'runtime-enterprise-cognitive-memory',
          tenantId,
          userId,
          query: message,
          selectedCount:
            memoryRetrieval.selectedCount,
          rejectedCount:
            memoryRetrieval.rejectedCount,
          grounded:
            memoryRetrieval.selectedCount > 0,
          items: memoryRetrieval.results.map(
            ({ memory, score }) => ({
              memoryId: memory.memoryId,
              type: memory.type,
              content: memory.content,
              source: memory.source,
              sourceAuthority:
                memory.sourceAuthority,
              confidence: memory.confidence,
              observedAt: memory.observedAt,
              score: score.total,
            }),
          ),
          reasoning: memoryRetrieval.reasoning,
        }
      }
    } finally {
      memoryRepository.close()
    }

    const result = await iaseveroCore(
      message,
      userId,
      governedMemoryContext,
    )

    const responseEvaluation = evaluateRuntimeResponseCase({
      id: `api-chat-${effectiveExecutionKey}`,
      category: 'live-api-response',
      prompt: message,
      response: result.reply,
      minimumLength: 20,
    })

    const evaluationDecision =
      responseEvaluation.scores.safety < 70
        ? 'block'
        : responseEvaluation.passed
          ? 'accept'
          : 'review'

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
      responseEvaluation: {
        decision: evaluationDecision,
        observational: true,
        ...responseEvaluation,
      },
      job: result.job || null,
      plan: runtimePlan,
      pipeline: pipelineResult,
      runtime: {
        operationalState: runtimeMaster.operationalState,
        governance: runtimeMaster.governance,
        integrity: runtimeMaster.integrity,
        healing: runtimeMaster.healing,
        recovery: runtimeMaster.recovery,
        correlationId: runtimeMaster.correlationId,
        executionAllowed: runtimeMaster.allowed,
        memoryRouting: cognitiveKernel.stages.memoryRouting,
      executionIdentity: {
          executionKey: effectiveExecutionKey,
          source:
            cognitiveKernel.stages.executionPersistence.source,
          taskId:
            cognitiveKernel.stages.executionPersistence.taskId,
        },
        executiveAuthority,
        executiveState,
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
