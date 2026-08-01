import assert from "node:assert/strict"
import fs from "node:fs"

const read = (path: string): string => fs.readFileSync(path, "utf8")

const route = read("app/api/chat/route.ts")
const decisionGate = read(
  "app/lib/runtime-core/runtime-decision-gate.ts",
)
const kernel = read(
  "app/lib/runtime-core/runtime-cognitive-kernel-integration.ts",
)
const authorityGateway = read(
  "app/lib/runtime-executive-authority-gateway/runtime-executive-authority-gateway.ts",
)

assert.match(
  route,
  /evaluateRuntimeDecisionGate\(/,
  "The API must consume the Runtime Decision Gate.",
)

assert.match(
  decisionGate,
  /const kernel = runRuntimeCognitiveKernel\(/,
  "The Decision Gate must obtain its authority from the Cognitive Kernel.",
)

assert.match(
  decisionGate,
  /if \(!kernel\.executionAllowed \|\| execution === null\)/,
  "The Decision Gate must deny when the Cognitive Kernel denies.",
)

assert.match(
  decisionGate,
  /allowed:\s*false/,
  "Kernel denial must produce a closed gate.",
)

assert.match(
  decisionGate,
  /const blocked\s*=/,
  "The Decision Gate may apply additional restrictive conditions.",
)

assert.match(
  decisionGate,
  /allowed:\s*!blocked/,
  "The Decision Gate must derive continuation from its restrictive checks.",
)

assert.doesNotMatch(
  decisionGate,
  /kernel\.executionAllowed\s*=\s*true/,
  "The Decision Gate must never mutate Kernel authority.",
)

assert.doesNotMatch(
  decisionGate,
  /executionAllowed:\s*true/,
  "The Decision Gate must not manufacture unconditional execution authority.",
)

assert.match(
  kernel,
  /const finalExecutionDecision\s*=/,
  "The Cognitive Kernel must own the consolidated final execution decision.",
)

assert.match(
  kernel,
  /finalDecision:\s*finalExecutionDecision/,
  "The Cognitive Kernel must expose its consolidated final decision.",
)

assert.match(
  kernel,
  /evaluateRuntimeExecutiveAuthorityGateway\(/,
  "The Cognitive Kernel must call the Executive Authority Gateway.",
)

assert.match(
  authorityGateway,
  /executionAllowed/,
  "The Executive Authority Gateway must formalize execution authority.",
)

const result = {
  canonicalOwner: "runtime-cognitive-kernel",
  authorityFormalizer: "runtime-executive-authority-gateway",
  restrictiveGate: "runtime-decision-gate",
  apiConsumer: "app/api/chat/route.ts",
  kernelDenialCanBeElevatedByGate: false,
  gateMayFurtherRestrict: true,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  "Runtime governed final execution ownership proof passed.",
)
console.log(result)
