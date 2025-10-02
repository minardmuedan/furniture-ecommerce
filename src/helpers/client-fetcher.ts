export async function clientFetch<T>(apiPath: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const res = await fetch(`${baseUrl}/api/${apiPath}`, init)
  if (!res.ok) {
    // todo : do some api error handling here
    throw 'Something went wrong'
  }

  const data = await res.json()
  return data
}
