import { readFileSync } from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const symbol = 'prepareGovernedEvolutionMissionControlledExternalReadProductionRouteConsumerBinding'
const source = readFileSync(routePath, 'utf8')

if (!source.includes(symbol)) {
  throw new Error(
    'RED: production route does not yet consume governed evolution mission route consumer binding',
  )
}

console.log('V287_74_30_FOUNDATION_PROOF=PASS')
