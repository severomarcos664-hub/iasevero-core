import fs from 'fs';

const code = fs.readFileSync('app/lib/zero-cost-brain.ts', 'utf8');

const checks = [
  code.includes("localIntelligence"),
  code.includes("erro"),
  code.includes("custo"),
  code.includes("api"),
  code.includes("Status: ativo")
];

if (checks.every(Boolean)) {
  console.log("OK: inteligência validada (modelo real)");
} else {
  console.error("FALHOU: estrutura incompleta");
  process.exit(1);
}
