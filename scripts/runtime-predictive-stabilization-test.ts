import { integrateRuntimeFeedback }
from '../app/lib/runtime-core/runtime-feedback-integration'

import { evaluateRuntimePredictiveStabilization }
from '../app/lib/runtime-core/runtime-predictive-stabilization'

integrateRuntimeFeedback()

const predictive =
  evaluateRuntimePredictiveStabilization()

console.log(
  '\n=== IASEVERO RUNTIME PREDICTIVE STABILIZATION ===\n'
)

console.log(predictive)
