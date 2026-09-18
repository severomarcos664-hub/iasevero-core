import assert from 'node:assert/strict'

import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from '../app/lib/runtime-core/runtime-tool-registry'

const registry = createRuntimeToolRegistry()

const sandboxTools = registry.tools.filter(
  (tool: RuntimeTool) => tool.id === 'sandbox.execution',
)

assert.equal(
  sandboxTools.length,
  1,
  'Sandbox execution must have exactly one canonical Tool Registry identity.',
)

const sandboxTool = sandboxTools[0]

assert.ok(sandboxTool)

assert.equal(
  sandboxTool.id,
  'sandbox.execution',
  'Sandbox Tool Registry identity must be canonical.',
)

/*
 * Registration is identity, not allowlist authority.
 * Registration is not invocation or execution authority.
 */
assert.equal(
  sandboxTool.allowed,
  false,
  'Sandbox execution must be registered fail-closed before later governed enablement.',
)

assert.equal(
  sandboxTool.critical,
  true,
  'Sandbox execution must be classified as security-critical.',
)

assert.ok(
  sandboxTool.timeoutMs > 0,
  'Sandbox execution must declare a bounded timeout policy.',
)

assert.ok(
  sandboxTool.retries >= 0,
  'Sandbox execution must declare an explicit retry policy.',
)

assert.ok(
  sandboxTool.fallback.trim().length > 0,
  'Sandbox execution must declare a non-empty fallback.',
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

console.log('Runtime governed sandbox tool registration RED proof unexpectedly passed.')
