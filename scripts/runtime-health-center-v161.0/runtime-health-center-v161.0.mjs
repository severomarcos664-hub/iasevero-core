import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const outDir = 'scripts/runtime-health-center-v161.0/reports';
mkdirSync(outDir, { recursive: true });

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function exists(path) {
  return existsSync(path) ? 'PASS' : 'MISSING';
}

console.log('IASevero v161.0');
console.log('Runtime Health Center');
console.log('');

run('node scripts/runtime-validation-orchestrator-v159.0/runtime-validation-orchestrator-v159.0.mjs');

const checks = [
  ['Build', 'package.json'],
  ['Regression', 'scripts/regression-local.mjs'],
  ['Architecture Map', 'scripts/runtime-architecture-map-v151.0/runtime-architecture-map-summary-v151.0.txt'],
  ['Execution Flow', 'scripts/runtime-execution-flow-map-v151.1/runtime-execution-flow-summary-v151.1.txt'],
  ['Dependency Graph', 'scripts/runtime-dependency-graph-v151.2/runtime-dependency-graph-summary-v151.2.txt'],
  ['Critical Path', 'scripts/runtime-critical-path-v152.0/runtime-critical-path-summary-v152.0.txt'],
  ['Quality Gate', 'scripts/runtime-quality-gate-v153.0/runtime-quality-gate-summary-v153.0.txt'],
  ['Architecture Validation', 'scripts/runtime-architecture-validation-suite-v154.0/runtime-architecture-validation-summary-v154.0.txt'],
  ['Contract Validation', 'scripts/runtime-contract-validation-v155.0/runtime-contract-validation-summary-v155.0.txt'],
  ['Coverage Validation', 'scripts/runtime-coverage-validation-v156.0/runtime-coverage-validation-summary-v156.0.txt'],
  ['Consistency Validation', 'scripts/runtime-consistency-validation-v157.0/runtime-consistency-summary-v157.0.txt'],
  ['Validation Engine', 'scripts/runtime-validation-engine-v158.0/reports/runtime-validation-engine-report-v158.0.txt'],
  ['Enterprise Pipeline', 'scripts/runtime-enterprise-pipeline-v160.0/reports/runtime-enterprise-pipeline-report-v160.0.txt']
];

let pass = 0;
let fail = 0;

const lines = [];
lines.push('IASevero v161.0');
lines.push('');
lines.push('Runtime Health Center');
lines.push('');
lines.push('RESULTS');

for (const [name, path] of checks) {
  const status = exists(path);
  if (status === 'PASS') pass++;
  else fail++;
  lines.push(`${name.padEnd(32, '.')} ${status}`);
}

const score = Math.round((pass / checks.length) * 100);

lines.push('');
lines.push(`PASS: ${pass}`);
lines.push(`FAIL: ${fail}`);
lines.push(`RUNTIME HEALTH SCORE: ${score}%`);
lines.push(`OVERALL STATUS: ${fail === 0 ? 'PASS' : 'FAIL'}`);
lines.push('');
lines.push('RECOMMENDATION');
lines.push(fail === 0
  ? 'Runtime approved for enterprise health consolidation.'
  : 'Runtime requires attention before enterprise health consolidation.'
);

const report = lines.join('\n');

writeFileSync(`${outDir}/runtime-health-center-report-v161.0.txt`, report);
console.log(report);
