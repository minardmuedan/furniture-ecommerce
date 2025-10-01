import 'server-only'

type RecordData = { attempt: number; lastUsed: number }
const records = new Map<string, RecordData>()

export function createMemoryRateLimiter(maxAttempts = 8, refill = { refilledAttempt: 5, perSeconds: 30 }) {
  const refillPerMs = refill.perSeconds * 1000

  return function allow(key: string) {
    const now = Date.now()
    const record: RecordData = records.get(key) ?? { attempt: maxAttempts, lastUsed: now }

    const elapsed = Math.floor((now - record.lastUsed) / refillPerMs)
    const newAttempt = record.attempt + elapsed * refill.refilledAttempt
    const recordAttempt = (record.attempt = Math.min(maxAttempts, newAttempt))

    const allowed = recordAttempt > 0
    if (!allowed) disallow()

    record.attempt -= 1
    record.lastUsed = now
    records.set(key, record)

    if (recordAttempt === 1) disallow()
    return { attempt: record.attempt }

    function disallow() {
      throw new RateLimit(Math.floor((record.lastUsed + refillPerMs - now) / 1000))
    }
  }
}

export class RateLimit {
  remainingSeconds: number

  constructor(remainingSeconds: number) {
    this.remainingSeconds = remainingSeconds
  }
}

// todo: add cleanup here
