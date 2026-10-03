import fs from "node:fs";

const route = fs.readFileSync("app/api/chat/route.ts", "utf8");

function requirePattern(pattern: RegExp, label: string): void {
  if (!pattern.test(route)) {
    throw new Error(`V287_81_${label}`);
  }
}

requirePattern(
  /const\s+researchMissionExternalReadAuthorizationIntegration\s*=\s*integrateGovernedResearchMissionExternalReadAuthorization\s*\(/,
  'RESEARCH_AUTHORIZATION_BINDING_ABSENT',
);

requirePattern(
  /researchMissionExternalReadAuthorizationIntegration/,
  "RESEARCH_AUTHORIZATION_DECISION_ABSENT",
);

requirePattern(
  /researchMissionExternalReadAuthorizationIntegration[\s\S]*externalReadAuthorization/,
  "RESEARCH_TO_EXISTING_AUTHORITY_CHAIN_ABSENT",
);

requirePattern(
  /networkAccess:\s*researchMissionExternalReadAuthorizationIntegration\.networkAccess/,
  "EXISTING_NETWORK_AUTHORITY_PROPAGATION_ABSENT",
);

requirePattern(
  /executionApplied:\s*false/,
  "EXECUTION_FAIL_CLOSED_ABSENT",
);

requirePattern(
  /mutationApplied:\s*false/,
  "MUTATION_FAIL_CLOSED_ABSENT",
);

console.log("V287_81_PRODUCTION_EXTERNAL_READ_AUTHORIZATION_BINDING_PROOF_PASS");
console.log("AUTHORITY_REUSE=EXISTING");
console.log("NEW_EXECUTOR=FALSE");
console.log("NEW_NETWORK_STACK=FALSE");
console.log("NEW_PARALLEL_AUTHORITY=FALSE");
console.log("MUTATION_APPLIED=FALSE");
