# IASevero Runtime Operational Call Graph

## Objetivo

Registrar o call graph operacional confirmado por evidências de código para o Runtime Master Orchestrator.

## Evidências confirmadas

O módulo principal está localizado em:

app/lib/runtime-core/runtime-master-orchestrator.ts

A função exportada é:

runRuntimeMasterOrchestrator()

## Chamadores confirmados

- app/lib/runtime-core/runtime-execution-bridge.ts
- app/api/runtime/status/route.ts
- app/api/runtime/telemetry/route.ts

## Dependências diretas confirmadas

O Runtime Master Orchestrator coordena diretamente:

- Runtime Governance Center
- Runtime Integrity Validator
- Runtime Policy Engine
- Runtime Adaptive Scheduler
- Runtime Lane Supervisor
- Runtime Self-Healing Coordinator
- Runtime Recovery Engine

## Cadeia operacional observada

API Routes
↓
Runtime Execution Bridge
↓
Runtime Master Orchestrator
↓
Governance
↓
Integrity
↓
Policy
↓
Scheduler
↓
Lanes
↓
Self-Healing
↓
Recovery
↓
Operational State
↓
Recommendation

## Conclusão

O Runtime Master Orchestrator está confirmado como coordenador operacional de alto nível.

Ainda não está confirmado como único coordenador operacional canônico, pois existem outros coordenadores e orquestradores especializados que precisam ser comparados quanto a ownership, hierarquia e sobreposição.

## Status da evidência

- Existência do módulo: confirmada.
- Função exportada: confirmada.
- Chamadores operacionais: confirmados.
- Dependências diretas: confirmadas.
- Papel de coordenação de alto nível: confirmado.
- Unicidade canônica: pendente de auditoria comparativa.
