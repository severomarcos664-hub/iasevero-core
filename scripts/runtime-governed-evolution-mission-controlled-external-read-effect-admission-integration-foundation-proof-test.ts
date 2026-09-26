import fs from "node:fs"

const route = fs.readFileSync("app/api/chat/route.ts", "utf8")

const binding =
  "governedEvolutionMissionControlledExternalReadProductionRouteConsumerBinding"

const declaration = route.indexOf(`const ${binding} =`)
if (declaration < 0) {
  throw new Error("Missing governed evolution mission production route consumer binding")
}

const downstream = route.slice(declaration + (`const ${binding} =`).length)

if (!downstream.includes(binding)) {
  throw new Error(
    "RED: governed evolution mission production route consumer binding is not consumed downstream by the controlled external read effect-admission path",
  )
}

if (!route.includes("executeRuntimeToolControlledExternalReadEffect")) {
  throw new Error("Missing canonical controlled external read effect executor")
}

console.log("V287_74_31_FOUNDATION_PROOF=PASS")
