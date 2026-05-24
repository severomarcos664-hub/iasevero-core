import {
  evaluateRuntimeCognitiveExecutionProfile,
} from '../../app/lib/runtime-execution-profiles/runtime-cognitive-execution-profiles'

const report =
  evaluateRuntimeCognitiveExecutionProfile()

console.log(
  '\n=== IASEVERO RUNTIME COGNITIVE EXECUTION PROFILE ===\n'
)

console.log(report)
