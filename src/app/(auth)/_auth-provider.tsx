'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type AuthProviderType = { signup: number | null }
type Context = { rateLimit: AuthProviderType; setRateLimit: Dispatch<SetStateAction<AuthProviderType>> }

const authProviderContext = createContext<Context>({ rateLimit: { signup: null }, setRateLimit: () => {} })

export const useAuthProvider = (auth: 'signup') => {
  const { rateLimit, setRateLimit } = useContext(authProviderContext)
  return { rateLimit: rateLimit[auth], setRateLimit: (value: AuthProviderType[typeof auth]) => setRateLimit({ [auth]: value }) }
}

export default function AuthProvider({ values, children }: { values: AuthProviderType; children: React.ReactNode }) {
  const [rateLimit, setRateLimit] = useState<AuthProviderType>(values)

  return <authProviderContext.Provider value={{ rateLimit, setRateLimit }}>{children}</authProviderContext.Provider>
}
