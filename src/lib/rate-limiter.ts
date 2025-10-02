import 'server-only'

type RecordData = { attempt: number; lastUsed: number }
const records = new Map<string, RecordData>()

export function createMemoryRateLimiter(maxAttempts = 8, refill = { refilledAttempt: 5, perSeconds: 30 }) {
  const refillPerMs = refill.perSeconds * 1000

  return async function allow(key: string) {
    const now = Date.now()
    const record: RecordData = records.get(key) ?? { attempt: maxAttempts, lastUsed: now }

    const elapsed = Math.floor((now - record.lastUsed) / refillPerMs)
    if (elapsed > 0) record.attempt = Math.min(maxAttempts, record.attempt + elapsed * refill.refilledAttempt)

    if (record.attempt <= 0) disallow(record, refillPerMs)

    record.attempt -= 1
    record.lastUsed = now
    records.set(key, record)

    return { record, refillPerMs }
  }
}

export function disallow(record: RecordData, refillPerMs: number): never {
  const now = Date.now()
  throw new RateLimit({ nextSubmit: (record.lastUsed + refillPerMs - now) / 1000 })
}

export class RateLimit {
  nextSubmit: number

  constructor(arg: { nextSubmit: number }) {
    this.nextSubmit = arg.nextSubmit
  }
}

// todo: add cleanup here
