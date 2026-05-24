import {
  evaluateRuntimeCognitiveResponseProfiler,
} from '../../app/lib/runtime-profiler/runtime-cognitive-response-profiler'

const report =
  evaluateRuntimeCognitiveResponseProfiler()

console.log(
  '\n=== IASEVERO RUNTIME COGNITIVE RESPONSE PROFILER ===\n'
)

console.log(report)
