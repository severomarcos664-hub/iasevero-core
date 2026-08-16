import type {
  RuntimeToolDnsResolvedAddress,
  RuntimeToolDnsResolver,
} from './runtime-tool-external-read-dns-resolution-boundary'

export type RuntimeToolDnsResolverAdapter = {
  readonly adapterId: 'governed-external-read-dns-resolver'
  readonly networkAccess: false
  readonly resolve: RuntimeToolDnsResolver
}

export function createRuntimeToolDnsResolverAdapter(
  resolve: RuntimeToolDnsResolver,
): RuntimeToolDnsResolverAdapter {
  return {
    adapterId: 'governed-external-read-dns-resolver',
    networkAccess: false,
    resolve: async (
      hostname: string,
    ): Promise<readonly RuntimeToolDnsResolvedAddress[]> => resolve(hostname),
  }
}
