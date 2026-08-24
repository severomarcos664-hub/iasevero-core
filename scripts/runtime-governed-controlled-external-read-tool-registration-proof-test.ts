import assert from 'node:assert/strict'

import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from '../app/lib/runtime-core/runtime-tool-registry'

const registry = createRuntimeToolRegistry()

const externalReadTools = registry.tools.filter(
  (tool: RuntimeTool) => tool.id === 'external.read',
)

assert.equal(
  externalReadTools.length,
  1,
  'Controlled external read must have exactly one canonical Tool Registry identity.',
)

const externalReadTool = externalReadTools[0]

assert.ok(externalReadTool)

assert.equal(
  externalReadTool.id,
  'external.read',
  'Controlled external read Tool Registry identity must be canonical.',
)

/*
 * Registration is identity, not execution authority.
 * External network access remains blocked by default in this version.
 */
assert.equal(
  externalReadTool.allowed,
  false,
  'Controlled external read must be registered fail-closed before later governed enablement.',
)

assert.equal(
  externalReadTool.critical,
  true,
  'Controlled external read must be classified as security-critical.',
)

assert.ok(
  externalReadTool.timeoutMs > 0,
  'Controlled external read must declare a bounded timeout policy.',
)

assert.ok(
  externalReadTool.retries >= 0,
  'Controlled external read must declare an explicit retry policy.',
)

assert.ok(
  externalReadTool.fallback.trim().length > 0,
  'Controlled external read must declare a non-empty fallback.',
)

assert.equal(
  registry.totalTools,
  registry.tools.length,
  'Tool Registry total must remain internally consistent.',
)

assert.equal(
  registry.allowedTools,
  registry.tools.filter((tool: RuntimeTool) => tool.allowed).length,
  'Allowed-tool count must remain internally consistent.',
)

assert.equal(
  registry.blockedTools,
  registry.tools.filter((tool: RuntimeTool) => !tool.allowed).length,
  'Blocked-tool count must remain internally consistent.',
)

console.log(
  'Runtime governed controlled external read tool registration proof passed.',
)

console.log({
  architecture: 'governed-controlled-external-read-tool-registration',
  toolId: externalReadTool.id,
  registered: true,
  allowed: externalReadTool.allowed,
  critical: externalReadTool.critical,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})
