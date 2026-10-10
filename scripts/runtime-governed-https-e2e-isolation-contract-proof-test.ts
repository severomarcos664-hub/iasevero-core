import assert from "node:assert/strict";

import {
  evaluateGovernedE2EIsolation
} from "../app/lib/orchestrator/runtime-governed-https-e2e-isolation-contract";

let eligible = 0;
let rejected = 0;

for (let mask = 0; mask < 32; mask++) {
  const evidence = {
    isolatedWorkspace: Boolean(mask & 1),
    persistentDataRedirected: Boolean(mask & 2),
    sqliteIsolationVerified: Boolean(mask & 4),
    originalRepositoryProtected: Boolean(mask & 8),
    networkAuthorityGranted: Boolean(mask & 16)
  };

  const result = evaluateGovernedE2EIsolation(evidence);

  const expected =
    evidence.isolatedWorkspace &&
    evidence.persistentDataRedirected &&
    evidence.sqliteIsolationVerified &&
    evidence.originalRepositoryProtected;

  assert.equal(result.isolationEligible, expected);
  assert.equal(result.executionAuthorized, false);
  assert.equal(result.executionApplied, false);
  assert.equal(result.mutationApplied, false);

  if (result.isolationEligible) {
    eligible++;
  } else {
    rejected++;
  }
}

assert.equal(eligible, 2);
assert.equal(rejected, 30);

console.log("COMBINATIONS_TESTED=32");
console.log("ISOLATION_ELIGIBLE=2");
console.log("ISOLATION_REJECTED=30");
console.log("EXECUTION_AUTHORITY=DENIED");
console.log("AUTHORITY_INVARIANTS=PASS");
console.log("CMD3597=PASS");
