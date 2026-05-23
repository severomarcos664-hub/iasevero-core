import {
  recoverRuntimeState
} from '../app/lib/runtime-core/runtime-recovery-engine'

const state =
  recoverRuntimeState()

console.log(
  '\n=== IASEVERO RUNTIME RECOVERY ENGINE ===\n'
)

console.log(state)
