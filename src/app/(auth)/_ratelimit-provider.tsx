'use client'

import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { createContext } from 'react'

export type RateLimitedDate = {
  signup: number
  resendEmailVerification: number
  login: number
  forgotPassword: number
  resendPasswordVerification: number
}

const rateLimitContext = createContext<{ nextSubmit: RateLimitedDate; setNextSubmit: Dispatch<SetStateAction<RateLimitedDate>> }>({
  nextSubmit: { signup: 0, resendEmailVerification: 0, login: 0, forgotPassword: 0, resendPasswordVerification: 0 },
  setNextSubmit: () => {},
})

export const useRateLimitContext = (auth: keyof RateLimitedDate) => {
  const { nextSubmit, setNextSubmit } = useContext(rateLimitContext)

  return {
    nextSubmit: nextSubmit[auth],
    setNextSubmit: (value: number) => setNextSubmit(prev => ({ ...prev, [auth]: value })),
    setNextSubmitOf: (auth: keyof RateLimitedDate, value: number) => setNextSubmit(prev => ({ ...prev, [auth]: value })),
  }
}

export default function RateLimitProvider({ defaultValues, children }: { defaultValues: RateLimitedDate; children: React.ReactNode }) {
  const [nextSubmit, setNextSubmit] = useState<RateLimitedDate>(defaultValues)
  return <rateLimitContext.Provider value={{ nextSubmit, setNextSubmit }}>{children}</rateLimitContext.Provider>
}
