import {
  evaluateRuntimeLiveCognitiveLoop,
} from '../../app/lib/runtime-live-cognitive-loop/runtime-live-cognitive-loop'

const report =
  evaluateRuntimeLiveCognitiveLoop()

console.log(
  '\n=== IASEVERO RUNTIME LIVE COGNITIVE LOOP ===\n'
)

console.log(report)
