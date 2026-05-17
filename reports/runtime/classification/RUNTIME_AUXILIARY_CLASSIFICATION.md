# IASevero Runtime Auxiliary Classification

## 1. ORCHESTRATION HELPERS

- decision-pipeline.ts
- routing.ts
- executor.ts
- runtime-task-planner.ts
- runtime-supervisor.ts

Purpose:
Support orchestration flow without owning runtime authority.

---

## 2. EVENT SYSTEM

- event-logger.ts
- events.ts
- runtime-event-bus.ts
- runtime-event-processor.ts

Purpose:
Runtime event propagation and logging.

---

## 3. MEMORY SYSTEM

- memory-governor.ts
- runtime-memory.ts
- runtime-operational-memory.ts
- runtime-snapshot.ts

Purpose:
Memory persistence and operational state support.

---

## 4. DIAGNOSTICS & HEALTH

- diagnostics.ts
- health-intelligence.ts
- runtime-guardian.ts
- runtime-limiter.ts
- state-engine.ts

Purpose:
Health analysis and runtime protection support.

---

## 5. EXECUTION SUPPORT

- queue-governor.ts
- provider-reputation.ts
- intelligent-selector.ts
- hybrid-router.ts

Purpose:
Provider and execution assistance.

---

## 6. TRANSITIONAL RUNTIME MODULES

- runtime.ts
- runtime-manifest.ts
- runtime-architecture-index.ts
- runtime-architecture-auditor.ts
- runtime-dependency-graph.ts
- runtime-dependency-scanner.ts
- runtime-graph-registry.ts

Purpose:
Temporary architectural transition modules during consolidation.

---

## 7. FUTURE RECLASSIFICATION CANDIDATES

Potential future promotions:

- runtime-supervisor.ts
- health-intelligence.ts
- intelligent-selector.ts
- runtime-guardian.ts

These may later become official layers or internal kernel services.

---

## 8. CURRENT ARCHITECTURAL STATUS

Status:
- stable
- governed
- modular
- under consolidation

Risk:
- controlled

Fragmentation:
- detected early
- under governance

