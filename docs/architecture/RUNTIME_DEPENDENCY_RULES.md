# IASevero Runtime Dependency Rules

## Allowed Direction

Kernel
  -> Control Plane
  -> Governance
  -> Execution
  -> Observability
  -> Intelligence
  -> Autonomy
  -> Validation

Lower layers must not control upper layers.

---

## Layer Rules

### Kernel
May coordinate all layers.

### Control Plane
May call governance, execution, state, and observability.

### Governance
May validate policy, contracts, budget, provider, and execution permission.

### Execution
May execute only after governance approval.

### Observability
May record telemetry, incidents, diagnostics, traces, and metrics.

### Intelligence
May analyze and suggest. It must not mutate runtime authority.

### Autonomy
May recover or stabilize only under governance boundaries.

### Validation
May scan, validate, and report. It must not execute runtime actions.

---

## Forbidden Imports

- autonomy -> governance mutation
- observability -> execution trigger
- validation -> execution trigger
- telemetry -> provider calls
- recovery -> provider calls without governance
- decision-engine -> uncontrolled direct ownership of all layers

---

## Canonical Rule

If a dependency creates recursion, circular governance, duplicated authority, or hidden execution, it must be redesigned.
