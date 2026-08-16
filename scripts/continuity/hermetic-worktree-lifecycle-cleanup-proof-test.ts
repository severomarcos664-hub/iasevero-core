import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

import { executeHermeticReproduction } from './hermetic-reproduction-executor'

function gitWorktreeState(): string {
  const result = spawnSync(
    'git',
    ['worktree', 'list', '--porcelain'],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
    },
  )

  assert.equal(result.status, 0)

  return result.stdout
}

function countReproductionWorktrees(state: string): number {
  return state
    .split('\n')
    .filter((line) =>
      line.startsWith('worktree /tmp/iasevero-reproduction-'),
    )
    .length
}

const before = gitWorktreeState()

assert.equal(countReproductionWorktrees(before), 0)

const first = executeHermeticReproduction(
  process.cwd(),
  'v287.24-governed-hermetic-reproduction-contract-proof',
)

assert.equal(first.reproductionExecuted, true)
assert.equal(first.reproductionSucceeded, true)

const afterFirst = gitWorktreeState()

assert.equal(countReproductionWorktrees(afterFirst), 0)

const second = executeHermeticReproduction(
  process.cwd(),
  'v287.24-governed-hermetic-reproduction-contract-proof',
)

assert.equal(second.reproductionExecuted, true)
assert.equal(second.reproductionSucceeded, true)

const afterSecond = gitWorktreeState()

assert.equal(countReproductionWorktrees(afterSecond), 0)

console.log('Governed hermetic worktree lifecycle cleanup proof passed.')
console.log({
  firstExecutionSucceeded: first.reproductionSucceeded,
  residueAfterFirstExecution: countReproductionWorktrees(afterFirst),
  secondExecutionSucceeded: second.reproductionSucceeded,
  residueAfterSecondExecution: countReproductionWorktrees(afterSecond),
  deploymentApplied: second.deploymentApplied,
  promotionApplied: second.promotionApplied,
  runtimeAuthorityGranted: second.runtimeAuthorityGranted,
  assertionCount: 9,
})
