import {
  evaluateRuntimeCoreIdentity,
} from '../../app/lib/runtime-cognitive-core/runtime-core-identity'

import {
  evaluateRuntimeAttentionRegistry,
} from '../../app/lib/runtime-cognitive-core/runtime-attention-registry'

import {
  evaluateRuntimeMetaController,
} from '../../app/lib/runtime-cognitive-core/runtime-meta-controller'

console.log('\n=== IASEVERO RUNTIME CORE IDENTITY ===\n')
console.log(evaluateRuntimeCoreIdentity())

console.log('\n=== IASEVERO RUNTIME ATTENTION REGISTRY ===\n')
console.log(evaluateRuntimeAttentionRegistry())

console.log('\n=== IASEVERO RUNTIME META CONTROLLER ===\n')
console.log(evaluateRuntimeMetaController())
