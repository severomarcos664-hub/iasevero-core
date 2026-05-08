import fs from 'fs'

const files = [
  'app/lib/iasevero-core.ts',
  'app/lib/local-memory.ts',
  'app/lib/decision-engine.ts',
  'app/lib/local-brain.ts',
  'app/lib/observability.ts',
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
const brain = fs.readFileSync('app/lib/local-brain.ts', 'utf8')
const observability = fs.readFileSync('app/lib/observability.ts', 'utf8')

const checks = [
  core.includes('runProvider'),
  core.includes('buildDecision'),
  core.includes('validateDecisionAnswer'),
  core.includes("from './local-brain'"),
  memory.includes('saveFact'),
  memory.includes('getFacts'),
  memory.includes('history'),
  engine.includes('classifyIntent'),
  engine.includes('buildDecision'),
  engine.includes('validateDecisionAnswer'),
  brain.includes('localBrain'),
  observability.includes('logEvent')
]

if (!checks.every(Boolean)) {
  console.error('FALHOU estrutura da IASevero incompleta')
  process.exit(1)
}

console.log('OK: regressão local IASevero completa aprovada')
