# IASevero Runtime Kernel Authority Map

## 1. Runtime Kernel

Authority:
- runtime ownership
- lifecycle ownership
- runtime state authority
- orchestration authority

Candidate modules:
- runtime-core.ts
- runtime-context.ts
- runtime-lifecycle-manager.ts
- runtime-state-registry.ts

Permissions:
- may mutate runtime state
- may control lifecycle
- may authorize execution

Restrictions:
- must remain minimal
- must never absorb intelligence logic
- must never absorb telemetry logic

---

## 2. Governance Layer

Authority:
- policy validation
- provider governance
- budget governance
- execution authorization

Modules:
- runtime-governor.ts
- runtime-policy.ts
- runtime-policy-engine.ts
- runtime-provider-governor.ts
- runtime-budget-control.ts
- runtime-enforcement.ts

Permissions:
- may approve execution
- may deny execution
- may validate contracts

Restrictions:
- must not execute runtime actions directly

---

## 3. Execution Layer

Authority:
- controlled execution
- provider routing
- runtime actions

Modules:
- runtime-execution-control.ts
- hybrid-router.ts
- runtime-action-executor.ts

Permissions:
- may execute actions
- may route providers

Restrictions:
- execution requires governance approval

---

## 4. Observability Layer

Authority:
- telemetry
- diagnostics
- metrics
- incidents

Modules:
- runtime-telemetry.ts
- runtime-incidents.ts
- metrics.ts
- trace.ts

Permissions:
- may observe
- may report

Restrictions:
- must NEVER mutate runtime state
- must NEVER execute actions

---

## 5. Intelligence Layer

Authority:
- awareness
- intelligence analysis
- runtime evaluation

Modules:
- runtime-awareness.ts
- runtime-intelligence.ts
- runtime-intelligence-policy.ts

Permissions:
- may suggest
- may analyze

Restrictions:
- must NEVER govern runtime
- must NEVER execute recovery

---

## 6. Autonomy Layer

Authority:
- recovery proposal
- stabilization proposal
- self-healing proposal

Modules:
- runtime-self-healing.ts
- runtime-recovery.ts
- runtime-conscious-loop.ts
- runtime-autonomous-stabilizer.ts

Permissions:
- may request recovery
- may request stabilization

Restrictions:
- must NEVER own runtime authority
- must NEVER bypass governance

---

## 7. Validation Layer

Authority:
- topology validation
- dependency validation
- structural validation

Modules:
- runtime-dependency-validator.ts
- runtime-topology-validator.ts
- runtime-structural-health.ts

Permissions:
- may validate
- may report violations

Restrictions:
- must NEVER execute fixes
- must NEVER trigger execution

---

## Current Runtime State

Status:
- stable
- governed
- modular
- canonicalization in progress

Risk:
- controlled

Fragmentation:
- under enforcement

