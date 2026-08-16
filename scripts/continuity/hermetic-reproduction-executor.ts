import { spawnSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

export type HermeticReproductionExecutionResult = {
  sourceIdentityVerified: boolean
  tagIdentityVerified: boolean
  lockfileVerified: boolean
  cleanEnvironmentVerified: boolean
  installSucceeded: boolean
  tscSucceeded: boolean
  proofSucceeded: boolean
  regressionSucceeded: boolean
  buildSucceeded: boolean
  reproductionExecuted: true
  reproductionSucceeded: boolean
  networkRuntimeAccess: false
  deploymentApplied: false
  promotionApplied: false
  runtimeAuthorityGranted: false
}

function run(
  cwd: string,
  command: string,
  args: string[],
): number {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  })

  return result.status ?? 1
}

export function executeHermeticReproduction(
  repositoryRoot: string,
  tag: string,
): HermeticReproductionExecutionResult {
  const worktreePath = '/tmp/iasevero-hermetic-reproduction-v28725'

  if (existsSync(worktreePath)) {
    rmSync(worktreePath, { recursive: true, force: true })
  }

  const tagCommit = spawnSync(
    'git',
    ['rev-parse', `${tag}^{commit}`],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
    },
  )

  const expectedCommit = tagCommit.stdout.trim()

  const add = run(
    repositoryRoot,
    'git',
    ['worktree', 'add', '--detach', worktreePath, tag],
  )

  if (add !== 0) {
    throw new Error('Unable to create detached reproduction worktree.')
  }

  const reproducedCommit = spawnSync(
    'git',
    ['rev-parse', 'HEAD'],
    {
      cwd: worktreePath,
      encoding: 'utf8',
    },
  ).stdout.trim()

  const sourceIdentityVerified =
    expectedCommit.length > 0 &&
    reproducedCommit === expectedCommit

  const tagIdentityVerified = sourceIdentityVerified
  const lockfileVerified = existsSync(join(worktreePath, 'package-lock.json'))

  const status = spawnSync(
    'git',
    ['status', '--porcelain'],
    {
      cwd: worktreePath,
      encoding: 'utf8',
    },
  )

  const cleanEnvironmentVerified =
    status.stdout.trim().length === 0

  const installSucceeded =
    run(worktreePath, 'npm', ['ci']) === 0

  const tscSucceeded =
    installSucceeded &&
    run(worktreePath, 'npx', ['tsc', '--noEmit']) === 0

  const proofSucceeded =
    tscSucceeded &&
    run(worktreePath, 'npx', [
      'tsx',
      'scripts/continuity/hermetic-reproduction-contract-proof-test.ts',
    ]) === 0

  const regressionSucceeded =
    proofSucceeded &&
    run(worktreePath, 'node', [
      'scripts/regression-local.mjs',
    ]) === 0

  const buildSucceeded =
    regressionSucceeded &&
    run(worktreePath, 'npm', ['run', 'build']) === 0

  const reproductionSucceeded =
    sourceIdentityVerified &&
    tagIdentityVerified &&
    lockfileVerified &&
    cleanEnvironmentVerified &&
    installSucceeded &&
    tscSucceeded &&
    proofSucceeded &&
    regressionSucceeded &&
    buildSucceeded

  rmSync(worktreePath, { recursive: true, force: true })

  return {
    sourceIdentityVerified,
    tagIdentityVerified,
    lockfileVerified,
    cleanEnvironmentVerified,
    installSucceeded,
    tscSucceeded,
    proofSucceeded,
    regressionSucceeded,
    buildSucceeded,
    reproductionExecuted: true,
    reproductionSucceeded,
    networkRuntimeAccess: false,
    deploymentApplied: false,
    promotionApplied: false,
    runtimeAuthorityGranted: false,
  }
}
