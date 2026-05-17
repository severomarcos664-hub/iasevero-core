# IASevero Runtime Dependency Governance

## Canonical Kernel

Official Kernel Candidate:
- central-runtime-core.ts

Official Orchestrator Node:
- runtime-decision-engine.ts

The decision engine must coordinate execution,
but must never become absolute runtime owner.

---

# Dependency Governance Rules

## RULE 1
Autonomy layer may NEVER mutate governance.

Forbidden:
- autonomy -> policy mutation
- autonomy -> contract mutation

---

## RULE 2
Observability layer may NEVER trigger execution.

Forbidden:
- telemetry -> runtime execution
- metrics -> provider execution
- diagnostics -> orchestration mutation

---

## RULE 3
Validation layer may NEVER perform recovery.

Forbidden:
- validator -> self-healing
- topology validator -> execution

---

## RULE 4
Execution layer must ALWAYS pass governance.

Required:
- provider approval
- budget approval
- execution approval

---

## RULE 5
Runtime state must have ONE authority source.

Candidate:
- runtime-context.ts

---

## RULE 6
No module may become God Object.

Especially:
- runtime-decision-engine.ts

---

## RULE 7
All runtime imports must follow layer direction.

Allowed:
Kernel
 -> Governance
 -> Execution
 -> Observability
 -> Intelligence
 -> Autonomy
 -> Validation

Forbidden:
reverse authority imports.

---

# Current Architectural Status

Status:
- stable
- governed
- under consolidation

Risk level:
- controlled

Fragmentation:
- detected early

