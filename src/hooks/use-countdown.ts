import { useEffect, useState } from 'react'

export default function useCountDown(defaultTime = 0) {
  const [timer, setTimer] = useState(defaultTime)

  useEffect(() => {
    if (timer <= 0) return

    const intervalId = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timer])

  return { timer, setTimer }
}
