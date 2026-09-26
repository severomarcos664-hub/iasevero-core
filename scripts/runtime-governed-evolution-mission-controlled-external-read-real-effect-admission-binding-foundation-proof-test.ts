import fs from "node:fs"

const route = fs.readFileSync("app/api/chat/route.ts", "utf8")

const declaration =
  "const governedEvolutionMissionControlledExternalReadEffectAdmissionIntegration"

const effect =
  "const toolControlledExternalReadEffect ="

const required =
  "governedEvolutionMissionControlledExternalReadEffectAdmissionIntegration.effectAdmissionPrepared === true"

const declarationIndex = route.indexOf(declaration)
if (declarationIndex < 0) {
  throw new Error("Missing governed evolution mission effect-admission integration")
}

const effectIndex = route.indexOf(effect, declarationIndex)
if (effectIndex < 0) {
  throw new Error("Missing canonical controlled external read real-effect boundary")
}

const effectWindow = route.slice(effectIndex, effectIndex + 1800)

if (!effectWindow.includes("executeRuntimeToolControlledExternalReadEffect")) {
  throw new Error("Missing canonical controlled external read real-effect executor")
}

if (!effectWindow.includes(required)) {
  throw new Error(
    "RED: governed evolution mission effectAdmissionPrepared is not bound into the final real-effect admission condition",
  )
}

console.log("V287_74_32_FOUNDATION_PROOF=PASS")
