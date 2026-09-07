import { request as httpsRequest } from 'node:https'
import { Readable } from 'node:stream'
import {
  evaluateRuntimeToolControlledExternalReadContract,
  type RuntimeToolControlledExternalReadContractInput,
  type RuntimeToolControlledExternalReadContractDecision,
} from './runtime-tool-controlled-external-read-contract'

export type RuntimeToolControlledExternalReadEffectResult = {
  contract: RuntimeToolControlledExternalReadContractDecision

  networkAttempted: boolean
  networkCompleted: boolean
  networkAccess: boolean

  externalReadApplied: boolean
  executionApplied: boolean

  externalMutation: false
  mutationApplied: false
  providerInvocation: false

  httpStatus: number | null
  contentType: string | null
  responseReceived: boolean
  responseBytes: number

  body: string | null
  reason: string
}

const MAX_RESPONSE_BYTES = 256 * 1024

export type RuntimeToolBoundedResponseBodyReadResult =
  | {
      exceeded: false
      body: string
      responseBytes: number
    }
  | {
      exceeded: true
      body: null
      responseBytes: number
    }

export async function readRuntimeToolBoundedResponseBody(
  response: Response,
  maxBytes: number,
): Promise<RuntimeToolBoundedResponseBodyReadResult> {
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
    throw new Error(
      'Bounded external-read response requires a positive finite byte budget.',
    )
  }

  if (response.body === null) {
    return {
      exceeded: false,
      body: '',
      responseBytes: 0,
    }
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let responseBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      if (value === undefined) {
        continue
      }

      responseBytes += value.byteLength

      if (responseBytes > maxBytes) {
        await reader.cancel(
          'Controlled external read response exceeds size policy.',
        )

        return {
          exceeded: true,
          body: null,
          responseBytes,
        }
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bodyBytes = new Uint8Array(responseBytes)
  let offset = 0

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  return {
    exceeded: false,
    body: new TextDecoder().decode(bodyBytes),
    responseBytes,
  }
}

export type RuntimeToolControlledExternalReadPinnedDestination = {
  readonly hostname: string
  readonly address: string
  readonly family: 4 | 6
}

function requestRuntimeToolPinnedHttps(
  url: URL,
  pinned: RuntimeToolControlledExternalReadPinnedDestination,
  timeoutMs: number,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const request = httpsRequest(
      {
        protocol: 'https:',
        hostname: pinned.address,
        family: pinned.family,
        port: url.port ? Number(url.port) : 443,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        servername: pinned.hostname,
        rejectUnauthorized: true,
        headers: {
          host: url.host,
          accept: 'text/html,text/plain,application/json;q=0.9,*/*;q=0.1',
          'user-agent': 'IASevero-Governed-External-Read/287.16',
        },
      },
      (incoming) => {
        const headers = new Headers()

        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) headers.append(name, item)
          } else if (value != null) {
            headers.set(name, value)
          }
        }

        resolve(
          new Response(Readable.toWeb(incoming) as ReadableStream, {
            status: incoming.statusCode ?? 502,
            statusText: incoming.statusMessage ?? '',
            headers,
          }),
        )
      },
    )

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error('Controlled external read HTTPS timeout.'))
    })

    request.on('error', reject)
    request.end()
  })
}

export async function executeRuntimeToolControlledExternalReadEffect(
  input: RuntimeToolControlledExternalReadContractInput,
  pinnedDestination?: RuntimeToolControlledExternalReadPinnedDestination,
): Promise<RuntimeToolControlledExternalReadEffectResult> {
  const contract =
    evaluateRuntimeToolControlledExternalReadContract(input)

  const blocked = (
    reason: string,
  ): RuntimeToolControlledExternalReadEffectResult => ({
    contract,

    networkAttempted: false,
    networkCompleted: false,
    networkAccess: false,

    externalReadApplied: false,
    executionApplied: false,

    externalMutation: false,
    mutationApplied: false,
    providerInvocation: false,

    httpStatus: null,
    contentType: null,
    responseReceived: false,
    responseBytes: 0,

    body: null,
    reason,
  })

  if (
    contract.contractEligible !== true ||
    contract.contractStatus !== 'eligible'
  ) {
    return blocked(
      `Controlled external read effect blocked by contract: ${contract.reason}`,
    )
  }

  const url = new URL(
    input.target.resource,
    `${input.target.protocol}//${input.target.host}`,
  )

  if (url.protocol !== 'https:') {
    return blocked(
      'Controlled external read effect requires HTTPS.',
    )
  }

  if (url.hostname.toLowerCase() !== input.target.host.trim().toLowerCase()) {
    return blocked(
      'Controlled external read effect rejected target host divergence.',
    )
  }

  try {
    if (
      pinnedDestination != null &&
      (
        pinnedDestination.hostname.trim().toLowerCase() !==
          input.target.host.trim().toLowerCase() ||
        pinnedDestination.address.trim().length === 0
      )
    ) {
      return blocked(
        'Controlled external read pinned destination does not match governed target.',
      )
    }

    const response =
      pinnedDestination != null
        ? await requestRuntimeToolPinnedHttps(
            url,
            pinnedDestination,
            input.envelope.policy.timeoutMs,
          )
        : await fetch(url, {
            method: 'GET',
            redirect: 'error',
            credentials: 'omit',
            cache: 'no-store',
            signal: AbortSignal.timeout(input.envelope.policy.timeoutMs),
            headers: {
              accept: 'text/html,text/plain,application/json;q=0.9,*/*;q=0.1',
              'user-agent': 'IASevero-Governed-External-Read/287.16',
            },
          })

    const contentLength = response.headers.get('content-length')
    if (
      contentLength !== null &&
      Number.isFinite(Number(contentLength)) &&
      Number(contentLength) > MAX_RESPONSE_BYTES
    ) {
      return {
        contract,
        networkAttempted: true,
        networkCompleted: true,
        networkAccess: true,
        externalReadApplied: false,
        executionApplied: false,
        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
        httpStatus: response.status,
        contentType: response.headers.get('content-type'),
        responseReceived: true,
        responseBytes: 0,
        body: null,
        reason: 'Controlled external read response exceeds size policy.',
      }
    }

    const boundedBody =
      await readRuntimeToolBoundedResponseBody(
        response,
        MAX_RESPONSE_BYTES,
      )

    const responseBytes = boundedBody.responseBytes

    if (boundedBody.exceeded) {
      return {
        contract,
        networkAttempted: true,
        networkCompleted: true,
        networkAccess: true,
        externalReadApplied: false,
        executionApplied: false,
        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
        httpStatus: response.status,
        contentType: response.headers.get('content-type'),
        responseReceived: true,
        responseBytes,
        body: null,
        reason: 'Controlled external read response exceeds size policy.',
      }
    }

    const body = boundedBody.body

    const succeeded =
      response.ok &&
      responseBytes > 0

    return {
      contract,

      networkAttempted: true,
      networkCompleted: true,
      networkAccess: true,

      externalReadApplied: succeeded,
      executionApplied: succeeded,

      externalMutation: false,
      mutationApplied: false,
      providerInvocation: false,

      httpStatus: response.status,
      contentType: response.headers.get('content-type'),
      responseReceived: true,
      responseBytes,

      body: succeeded ? body : null,
      reason: succeeded
        ? 'Controlled external read completed successfully.'
        : `Controlled external read returned HTTP ${response.status}.`,
    }
  } catch (error) {
    return {
      contract,

      networkAttempted: true,
      networkCompleted: false,
      networkAccess: false,

      externalReadApplied: false,
      executionApplied: false,

      externalMutation: false,
      mutationApplied: false,
      providerInvocation: false,

      httpStatus: null,
      contentType: null,
      responseReceived: false,
      responseBytes: 0,

      body: null,
      reason:
        error instanceof Error
          ? `Controlled external read failed: ${error.message}`
          : 'Controlled external read failed with an unknown error.',
    }
  }
}
