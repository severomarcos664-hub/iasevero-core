export interface RuntimeRecoveryState {
  service: string
  failed: boolean
  retries: number
}

export class RuntimeRecoveryEngine {
  private recoveryLog: RuntimeRecoveryState[] = []

  registerFailure(service: string) {
    const entry: RuntimeRecoveryState = {
      service,
      failed: true,
      retries: 0
    }

    this.recoveryLog.push(entry)

    return entry
  }

  retry(service: string) {
    const target = this.recoveryLog.find(
      (item) => item.service === service
    )

    if (!target) {
      return null
    }

    target.retries += 1

    return target
  }

  getRecoveryState() {
    return this.recoveryLog
  }
}

export const runtimeRecoveryEngine =
  new RuntimeRecoveryEngine()
