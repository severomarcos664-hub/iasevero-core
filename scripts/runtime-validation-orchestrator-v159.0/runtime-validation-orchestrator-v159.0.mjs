import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const version = "v159.0";
const outDir = "scripts/runtime-validation-orchestrator-v159.0/reports";
mkdirSync(outDir, { recursive: true });

const checks = [];

function checkFile(name, path) {
  checks.push({
    name,
    status: existsSync(path) ? "PASS" : "FAIL",
    detail: existsSync(path) ? path : `Missing: ${path}`,
  });
}

function checkCommand(name, command) {
  try {
    execSync(command, { stdio: "pipe" });
    checks.push({ name, status: "PASS", detail: command });
  } catch (err) {
    checks.push({ name, status: "FAIL", detail: command });
  }
}

checkCommand("Build", "npm run build");
checkCommand("Regression", "node scripts/regression-local.mjs");

checkFile("Architecture Map", "scripts/runtime-architecture-map-v151.0/runtime-architecture-map-summary-v151.0.txt");
checkFile("Execution Flow", "scripts/runtime-execution-flow-map-v151.1/runtime-execution-flow-summary-v151.1.txt");
checkFile("Dependency Graph", "scripts/runtime-dependency-graph-v151.2/runtime-dependency-graph-summary-v151.2.txt");
checkFile("Critical Path", "scripts/runtime-critical-path-v152.0/runtime-critical-path-summary-v152.0.txt");
checkFile("Quality Gate", "scripts/runtime-quality-gate-v153.0/runtime-quality-gate-summary-v153.0.txt");
checkFile("Architecture Validation Suite", "scripts/runtime-architecture-validation-suite-v154.0/runtime-architecture-validation-summary-v154.0.txt");
checkFile("Contract Validation", "scripts/runtime-contract-validation-v155.0/runtime-contract-validation-summary-v155.0.txt");
checkFile("Coverage Validation", "scripts/runtime-coverage-validation-v156.0/runtime-coverage-validation-summary-v156.0.txt");
checkFile("Consistency Validation", "scripts/runtime-consistency-validation-v157.0/runtime-consistency-summary-v157.0.txt");
checkFile("Validation Engine", "scripts/runtime-validation-engine-v158.0/reports/runtime-validation-engine-report-v158.0.txt");

const pass = checks.filter(c => c.status === "PASS").length;
const fail = checks.filter(c => c.status === "FAIL").length;
const score = Math.round((pass / checks.length) * 100);
const overall = fail === 0 ? "PASS" : score >= 80 ? "WARNING" : "FAIL";

const report = [
  `IASevero ${version}`,
  "",
  "Runtime Validation Orchestrator",
  "",
  "RESULTS",
  ...checks.map(c => `${c.name.padEnd(38, ".")} ${c.status}`),
  "",
  `PASS: ${pass}`,
  `FAIL: ${fail}`,
  `RUNTIME HEALTH SCORE: ${score}%`,
  `OVERALL STATUS: ${overall}`,
  "",
  "DETAILS",
  ...checks.map(c => `${c.status} | ${c.name} | ${c.detail}`),
  "",
].join("\n");

writeFileSync(`${outDir}/runtime-validation-orchestrator-report-v159.0.txt`, report);
console.log(report);

if (overall === "FAIL") process.exit(1);
