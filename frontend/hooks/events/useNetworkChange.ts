import { useEffect, useState } from 'react'

type OnlineStatus = 'offline' | 'online'

const handleNetworkChange = (): void => {
  const isOnline: OnlineStatus = navigator.onLine ? 'online' : 'offline'
  document.documentElement.setAttribute('connection-status', isOnline)
}

export const useNetworkChange = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window !== undefined) {
      handleNetworkChange()
      setIsOnline(navigator.onLine ? true : false)

      window.addEventListener('online', handleNetworkChange)
      window.addEventListener('offline', handleNetworkChange)

      return () => {
        window.removeEventListener('online', handleNetworkChange)
        window.removeEventListener('offline', handleNetworkChange)
      }
    }
  }, [])

  return { isOnline, setIsOnline }
}
