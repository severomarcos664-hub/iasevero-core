import {
  buildRuntimeUnifiedIntelligence,
} from './runtime-unified-intelligence-service'

import {
  validateRuntimeUnifiedIntelligence,
} from './runtime-unified-intelligence-validator'

export function coordinateRuntimeUnifiedIntelligence(input = {}) {
  const intelligence = buildRuntimeUnifiedIntelligence(input)

  const validation =
    validateRuntimeUnifiedIntelligence(intelligence)

  return {
    intelligence,
    validation,
  }
}
