# IASevero Master Continuity Contract

Status: FOUNDATION
Authority: Git-backed continuity source of truth
Canonical architecture root: `docs/architecture/`
Canonical continuity root: `docs/architecture/continuity/`

## 1. Purpose

This contract is the canonical entry point for engineering continuity of IASevero.

Its purpose is to prevent:

- reconstruction of architecture from chat memory;
- repeated repository rediscovery;
- baseline ambiguity;
- roadmap being reported as implementation;
- duplicated architectural ownership;
- loss of version/proof relationships;
- accidental bypass of governance boundaries.

A new engineering session or chat MUST recover continuity from Git evidence before proposing implementation changes.

## 2. Source-of-truth precedence

When information conflicts, use this precedence:

1. Git objects, branches, immutable tags and commit ancestry.
2. `current-baseline.json`, when validated against Git.
3. Executable proof tests and their versioned source.
4. Canonical architecture and continuity ledgers.
5. Historical reports and archived continuity material.
6. Chat context, summaries and model-generated descriptions.

Chat context is supporting context only. It is not architectural authority.

Model output is proposal, not authority.

## 3. Current verified runtime baseline

Operational branch:

`v276-runtime-cognitive-kernel`

Official tag:

`v287.8-governed-tool-execution-failure-timeout-retry-governance-proof`

Verified commit:

`d316e3076467229a562d636980f240418f92514d`

The runtime baseline recorded in `current-baseline.json` MUST be an ancestor of, or equal to, the commit containing this continuity foundation.

## 4. Canonical ownership

Architecture documentation owner:

`docs/architecture/`

Continuity architecture owner:

`docs/architecture/continuity/`

Historical continuity material remains preserved under:

`scripts/platform-continuity-v107.0/`

Historical continuity is evidence of project evolution and MUST NOT automatically be treated as current architectural authority.

Do not create a competing continuity root while this owner is active.

## 5. Claim governance

Every capability or technology claim MUST use one of these states:

### PROVED

Implemented and supported by explicit versioned evidence.

Minimum expectation:

- implementation exists;
- canonical owner is identifiable;
- proof evidence exists;
- relevant regression is preserved;
- associated commit/tag can be recovered.

### PARTIALLY_PROVED

Material implementation/evidence exists, but one or more important boundaries remain unproved.

The missing boundary MUST be stated explicitly.

### FOUNDATION

Architecture, contract or infrastructure exists, but it does not by itself prove the complete operational capability.

### ROADMAP

Accepted future direction only.

ROADMAP MUST NOT be described as implemented.

Roadmap acceptance does not imply:

- implementation;
- operational readiness;
- safety approval;
- execution authorization;
- provider authorization.

## 6. Permanent architectural invariants

The following distinctions MUST remain explicit:

`signal != decision != authorization != dispatch != execution != mutation`

Capability eligibility is not execution authorization.

Executor eligibility is not execution.

Execution is not external mutation.

Training is not model approval.

Benchmark improvement is not safety approval.

Model approval is not execution authorization.

Model output is proposal, not authority.

Governance MUST precede execution.

## 7. Engineering protocol

Before implementation:

1. fetch origin and tags;
2. confirm operational branch;
3. confirm official baseline tag;
4. confirm exact baseline commit;
5. confirm local/remote convergence;
6. confirm working tree clean;
7. create an isolated work branch;
8. identify the existing canonical owner;
9. avoid creating competing runtime owners.

During implementation:

1. one architectural responsibility per version;
2. smallest technically sufficient change;
3. no interactive editor requirement;
4. TypeScript validation;
5. specific proof;
6. relevant regressions;
7. production build;
8. `git diff --check`;
9. explicit diff review;
10. explicit staging;
11. cached diff validation.

Before preservation:

1. commit;
2. reproduce proofs from the clean commit;
3. create immutable official tag;
4. publish work branch;
5. publish tag;
6. verify remote hashes;
7. verify fast-forward ancestry;
8. integrate with `merge --ff-only`;
9. push operational baseline;
10. verify final hash convergence;
11. verify working tree clean.

No force push for official history.

Preserve before removing.

## 8. Cost and external-effect governance

IASevero remains local-first whenever technically viable.

External incremental cost SHOULD remain zero whenever possible.

Paid providers require explicit authorization.

External mutation requires governed authorization.

Read-only/local execution precedes external read.

External read precedes external mutation.

Do not infer authorization from technical availability.

## 9. Verified governed tool execution line

The current verified progression is:

`Capability Governance`
→ `Executive Authorization`
→ `Dispatch Application`
→ `Execution Gate`
→ `Execution Handoff`
→ `Execution Adapter Contract`
→ `Invocation Envelope`
→ `Controlled Executor Boundary`
→ `Safe Local Execution`
→ `Idempotency / Replay Protection`
→ `Failure / Timeout-Budget / Retry Governance`

Relevant v287 progression:

- v287.0 — Governed Tool Dispatch Application
- v287.1 — Governed Tool Execution Gate
- v287.2 — Governed Tool Execution Handoff
- v287.3 — Governed Tool Execution Adapter Contract
- v287.4 — Governed Tool Execution Invocation Envelope
- v287.5 — Governed Tool Execution Controlled Executor Boundary
- v287.6 — Governed Tool Execution Safe Local Execution
- v287.7 — Governed Tool Execution Idempotency / Replay Protection
- v287.8 — Governed Tool Execution Failure / Timeout-Budget / Retry Governance

## 10. Current execution boundaries

At the verified v287.8 runtime baseline:

- safe local deterministic execution exists for the explicitly constrained executor path;
- replay protection exists with process-local scope;
- duplicate applied execution can be blocked within that scope;
- retry budget is governed;
- blocked execution is not retried;
- executor failures can be classified;
- external mutation remains outside this proof;
- network access is not granted by the safe-local proof;
- arbitrary shell execution is not granted;
- paid provider execution is not granted.

Timeout semantics are deliberately limited:

- `timeoutMs` is a declared execution budget;
- `timeoutEnforced=false`;
- preemptive timeout is NOT proved.

No later continuity document may upgrade these claims without new evidence.

## 11. Continuity Pack components

The canonical Continuity Pack consists of:

- `current-baseline.json`
- `MASTER-CONTINUITY.md`
- `ARCHITECTURE-LEDGER.md`
- `VERSION-LEDGER.md`
- `ADVANCED-TECHNOLOGY-ROADMAP.md`
- machine-verifiable continuity integrity proof

Until all components are created and proved, the pack remains `FOUNDATION`.

## 12. New-chat bootstrap contract

A new chat or engineering session MUST NOT reconstruct IASevero from memory first.

It must begin by:

1. reading this file;
2. reading `current-baseline.json`;
3. validating the declared baseline against Git;
4. reading the Architecture Ledger;
5. reading the Version Ledger;
6. reading the Advanced Technology Roadmap when future technology is relevant;
7. confirming the current work branch and clean/dirty state.

Only after those checks may the next architectural change be proposed.

If chat context conflicts with Git-backed continuity evidence, Git-backed evidence wins.

## 13. Continuity closeout rule

A future official version is not fully closed until continuity metadata affected by that version is updated.

At minimum, closeout MUST evaluate whether to update:

- current baseline;
- version ledger;
- architecture ledger;
- advanced technology status;
- known limitations;
- next verified frontier.

The continuity integrity proof MUST then pass before final preservation.
