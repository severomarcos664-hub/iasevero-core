import fs from "node:fs";
import path from "node:path";

const ownerPath = path.resolve(
  "app/lib/runtime-core/runtime-governed-research-mission-external-read-authorization-integration.ts",
);

if (!fs.existsSync(ownerPath)) {
  throw new Error("V287_80_RED_OWNER_ABSENT");
}

const source = fs.readFileSync(ownerPath, "utf8");

const required = [
  "GovernedResearchMissionExternalReadAuthorizationIntegrationInput",
  "GovernedResearchMissionExternalReadAuthorizationIntegrationDecision",
  "integrateGovernedResearchMissionExternalReadAuthorization",
  "researchMissionExternalReadCapabilityRequestEligible",
  "requires-existing-controlled-authorization",
  "executionKey",
  "correlationId",
  "traceId",
  "stepId",
  "networkAccess: false",
  "externalReadApplied: false",
  "executionApplied: false",
  "mutationApplied: false",
];

for (const token of required) {
  if (!source.includes(token)) {
    throw new Error(`V287_80_REQUIRED_TOKEN_MISSING:${token}`);
  }
}

if (
  !source.includes("runtime-tool-controlled-external-read-authorization-boundary") ||
  !source.includes("evaluateRuntimeToolControlledExternalReadAuthorizationBoundary")
) {
  throw new Error("V287_80_EXISTING_AUTHORITY_REUSE_MISSING");
}

if (/networkAccess:\s*true/.test(source)) {
  throw new Error("V287_80_NETWORK_AUTHORITY_ESCALATION");
}

if (/executionApplied:\s*true/.test(source)) {
  throw new Error("V287_80_EXECUTION_ESCALATION");
}

if (/mutationApplied:\s*true/.test(source)) {
  throw new Error("V287_80_MUTATION_ESCALATION");
}

console.log("V287_80_EXTERNAL_READ_AUTHORIZATION_INTEGRATION_FOUNDATION_PROOF=PASS");
console.log("AUTHORITY_REUSE=EXISTING_CONTROLLED_EXTERNAL_READ_AUTHORIZATION_BOUNDARY");
console.log("PARALLEL_AUTHORITY=FALSE");
console.log("NETWORK_ACCESS=FALSE");
console.log("EXECUTION_APPLIED=FALSE");
console.log("MUTATION_APPLIED=FALSE");
