import {
  validateRuntimeIntegrity
} from '../app/lib/runtime-core/runtime-integrity-validator'

const report =
  validateRuntimeIntegrity()

console.log(
  '\n=== IASEVERO RUNTIME INTEGRITY VALIDATOR ===\n'
)

console.log(report)
