import {
  replayRuntimeState
} from '../app/lib/runtime-core/runtime-state-replay-engine'

const replay =
  replayRuntimeState()

console.log(
  '\n=== IASEVERO RUNTIME STATE REPLAY ENGINE ===\n'
)

console.log(replay)
