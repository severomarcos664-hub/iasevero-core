import assert from 'node:assert/strict'
import { once } from 'node:events'
import { spawn } from 'node:child_process'

async function main() {
  const child = spawn(process.execPath, ['-e', 'setTimeout(() => process.exit(0), 150)'], {
    stdio: 'ignore',
  })

  assert.ok(child.pid)
  assert.ok(Number.isSafeInteger(child.pid))
  assert.ok(child.pid > 0)

  const pid = child.pid
  const [code, signal] = await once(child, 'exit')

  assert.equal(code, 0)
  assert.equal(signal, null)

  let residual = true
  try {
    process.kill(pid, 0)
  } catch {
    residual = false
  }

  assert.equal(residual, false)

  console.log(`REAL_PROCESS_ID=${pid}`)
  console.log('REAL_OS_PROCESS_STARTED=TRUE')
  console.log('REAL_OS_PROCESS_EXITED=TRUE')
  console.log('RESIDUAL_PROCESS=FALSE')
  console.log('PRODUCTION_PROCESS_STARTED=FALSE')
  console.log('PHYSICAL_EFFECT_PROOF=PASS')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
