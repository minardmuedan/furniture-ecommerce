export default function Home() {
  const now = Date.now()
  const lastUsed = 1759291282145

  const secondsElapsed = (now - lastUsed) / 1000
  const elapsed = now - lastUsed
  return <pre>{JSON.stringify({ now, lastUsed, secondsElapsed, elapsed: Math.floor(elapsed / 30_000) }, null, 2)}</pre>
}
