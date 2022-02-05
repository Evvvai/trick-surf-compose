import { useEffect, useState } from 'react'

export const useResizeWindow = () => {
  const [width, setWidth] = useState<number>(window.screen.width)

  const handleResizeWindow = (e: any): void =>
    setWidth(e.currentTarget.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', handleResizeWindow)

    return (): void => {
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [])

  return { width, setWidth }
}
