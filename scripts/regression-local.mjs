import fs from 'fs'

const files = [
  'app/lib/iasevero-core.ts',
  'app/lib/local-memory.ts',
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

const checks = [
  core.includes('getHistory'),
  core.includes('saveMessage'),
  core.includes('saveFact'),
  core.includes('runProvider'),
  memory.includes('saveFact'),
  memory.includes('getFacts'),
  memory.includes('history'),
  memory.includes('facts')
]

if (!checks.every(Boolean)) {
  console.error('FALHOU estrutura de memória/inteligência incompleta')
  process.exit(1)
}

console.log('OK: regressão local IASevero aprovada')
