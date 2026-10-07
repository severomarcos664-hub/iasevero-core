import { readFileSync } from 'node:fs'

type ControlledLinuxProcessStartTicksReadText =
  (
    sourcePath: string,
    encoding: 'utf8',
  ) => string

export type ControlledLinuxProcessStartTicksReadResult =
  Readonly<{
    schemaVersion: 1
    kind: 'iasevero-controlled-linux-process-start-ticks-read'

    processId: number
    sourcePath: string
    processStartTicks: number

    processStartTicksRead: true

    processIncarnationVerified: false
    readinessGranted: false
    livenessGranted: false
    runtimeAuthorityGranted: false
    networkAuthorityGranted: false
  }>

function defaultReadText(
  sourcePath: string,
  encoding: 'utf8',
): string {
  return readFileSync(sourcePath, encoding)
}

function controlledLinuxProcessStatPath(
  processId: number,
): string {
  return `/proc/${processId}/stat`
}

export function readControlledLinuxProcessStartTicks(
  processId: number,
  readText: ControlledLinuxProcessStartTicksReadText =
    defaultReadText,
): ControlledLinuxProcessStartTicksReadResult {
  if (
    !Number.isSafeInteger(processId) ||
    processId <= 0
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader requires a valid processId.',
    )
  }

  const sourcePath =
    controlledLinuxProcessStatPath(processId)

  const statText =
    readText(sourcePath, 'utf8')

  if (
    typeof statText !== 'string' ||
    statText.length === 0
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader requires non-empty process stat evidence.',
    )
  }

  const openParen =
    statText.indexOf('(')

  const closeParen =
    statText.lastIndexOf(')')

  if (
    openParen <= 0 ||
    closeParen <= openParen
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader rejected malformed process stat evidence.',
    )
  }

  const observedProcessIdText =
    statText.slice(0, openParen).trim()

  if (
    !/^\d+$/.test(observedProcessIdText)
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader rejected invalid observed processId.',
    )
  }

  const observedProcessId =
    Number(observedProcessIdText)

  if (
    !Number.isSafeInteger(observedProcessId) ||
    observedProcessId !== processId
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader rejected mismatched process identity.',
    )
  }

  /*
   * /proc/<pid>/stat:
   *
   * field 1 = pid
   * field 2 = comm, enclosed in parentheses
   * field 3 begins immediately after the final closing parenthesis
   *
   * The comm value may contain spaces and ')' characters, therefore
   * splitting the complete record on whitespace is not safe.
   *
   * After removing fields 1 and 2, index 0 represents field 3.
   * Linux field 22 (starttime) is therefore remainder index 19.
   */

  const remainder =
    statText.slice(closeParen + 1).trim()

  const fields =
    remainder.length > 0
      ? remainder.split(/\s+/)
      : []

  if (fields.length < 20) {
    throw new Error(
      'Controlled Linux process start ticks reader requires Linux stat field 22.',
    )
  }

  const processStartTicksText =
    fields[19]

  if (
    typeof processStartTicksText !== 'string' ||
    !/^\d+$/.test(processStartTicksText)
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader rejected invalid processStartTicks.',
    )
  }

  const processStartTicks =
    Number(processStartTicksText)

  if (
    !Number.isSafeInteger(processStartTicks) ||
    processStartTicks <= 0
  ) {
    throw new Error(
      'Controlled Linux process start ticks reader requires valid processStartTicks.',
    )
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    kind:
      'iasevero-controlled-linux-process-start-ticks-read' as const,

    processId,
    sourcePath,
    processStartTicks,

    processStartTicksRead: true as const,

    processIncarnationVerified: false as const,
    readinessGranted: false as const,
    livenessGranted: false as const,
    runtimeAuthorityGranted: false as const,
    networkAuthorityGranted: false as const,
  })
}
