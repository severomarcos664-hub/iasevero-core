# IASevero Runtime Canonical Execution Flow

Status: fluxo principal comprovado e subfluxos internos classificados por evidência.

## 1. Regra de classificação

- `PROVED`: chamada diretamente comprovada no caminho auditado.
- `PARTIALLY_PROVED`: relação interna comprovada, sem prova ponta a ponta completa.
- `NOT_CLAIMED`: integração não declarada sem evidência reproduzível.

## 2. Fluxo principal comprovado

```text
HTTP Request
    ↓
app/api/chat/route.ts
    ↓
Validation and Execution Identity
    ↓
Runtime Decision Engine
    ↓
Runtime Decision Gate
    ↓
Runtime Cognitive Kernel
    ↓
Executive Authority Gateway
    ↓
finalExecutionDecision
    ↓
Governed Enterprise Memory Retrieval
    ↓
IASevero Core
    ↓
Response Evaluation
    ↓
Tool Orchestrator Observation
    ↓
Runtime Trace Response
    ↓
NextResponse
```

Status: `PROVED` no caminho auditado da API.

## 3. Ownership decisório

- Runtime Decision Gate controla a continuidade.
- Runtime Cognitive Kernel consolida os estágios e decisões.
- Executive Authority Gateway formaliza a autoridade executiva.
- finalExecutionDecision representa a decisão final consolidada.
- Componentes inferiores não assumem ownership da decisão final.

## 4. Subfluxo adaptativo interno

Componentes relacionados internamente:

- Execution Pipeline
- Hybrid Decision Evaluator
- Adaptive Decision Layer
- Execution Governance Matrix
- Consensus Engine
- Execution Bridge

A ordem linear completa desse subfluxo em toda requisição da API ainda não foi comprovada.

Status: `PARTIALLY_PROVED`.

## 5. Limitações

- execução externa de ferramentas não comprovada;
- mutação de memória não comprovada;
- ordem ponta a ponta do subfluxo adaptativo não comprovada;
- Task Planner diretamente integrado a `/api/chat` não comprovado.

## 6. Garantias

```text
executionApplied=false
mutationApplied=false
externalProviderRequired=false
```

Nenhuma capacidade deve ser promovida a `PROVED` sem evidência reproduzível.
