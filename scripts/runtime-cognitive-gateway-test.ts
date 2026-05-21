import { evaluateRuntimeCognitiveGateway } from '../app/lib/runtime-core/runtime-cognitive-gateway'

const decision = evaluateRuntimeCognitiveGateway()

console.log('\n=== IASEVERO RUNTIME COGNITIVE GATEWAY ===\n')
console.log(decision)
