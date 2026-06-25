import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const outDir = "scripts/runtime-enterprise-pipeline-v160.0/reports";
mkdirSync(outDir, { recursive: true });

function run(command) {
  execSync(command, { stdio: "inherit" });
}

console.log("IASevero v160.0");
console.log("Runtime Enterprise Pipeline");
console.log();

run("node scripts/runtime-validation-orchestrator-v159.0/runtime-validation-orchestrator-v159.0.mjs");

const report = `IASevero v160.0

Runtime Enterprise Pipeline

STATUS
PASS

PIPELINE
Runtime Validation Orchestrator v159.0 executed successfully.

RESULT
Enterprise validation pipeline completed.
`;

writeFileSync(`${outDir}/runtime-enterprise-pipeline-report-v160.0.txt`, report);
console.log(report);
