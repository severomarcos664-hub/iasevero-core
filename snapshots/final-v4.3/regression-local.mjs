import fs from 'fs'

const files = [
  'app/lib/iasevero-core.ts',
  'app/lib/local-memory.ts',
  'app/lib/decision-engine.ts',
  'app/lib/response-quality.ts',
  'app/api/chat/route.ts',
  'data/memory.json'
]

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error('FALHOU arquivo ausente:', file)
    process.exit(1)
  }
}

const core = fs.readFileSync('app/lib/iasevero-core.ts', 'utf8')
const memory = fs.readFileSync('app/lib/local-memory.ts', 'utf8')
const engine = fs.readFileSync('app/lib/decision-engine.ts', 'utf8')
const mode = fs.readFileSync('app/lib/mode.ts', 'utf8')

const checks = [
  core.includes('runProvider'),
  core.includes('buildDecision'),
  core.includes('validateDecisionAnswer'),
  memory.includes('saveFact'),
  memory.includes('getFacts'),
  memory.includes('history'),
  memory.includes('facts'),
  engine.includes('classifyIntent'),
  engine.includes('buildDecision'),
  engine.includes('validateDecisionAnswer'),
  mode.includes("return 'safe'")
]

if (!checks.every(Boolean)) {
  console.error('FALHOU estrutura do decision engine incompleta')
  process.exit(1)
}

console.log('OK: regressão local IASevero + decision engine aprovada')
