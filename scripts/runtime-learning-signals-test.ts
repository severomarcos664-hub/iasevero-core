import {
  generateRuntimeLearningSignal,
} from '../app/lib/runtime-core/runtime-learning-signals'

const report =
  generateRuntimeLearningSignal()

console.log('\n=== IASEVERO RUNTIME LEARNING SIGNALS ===\n')
console.log(report)
