import { MutableRefObject, useEffect, useState } from 'react'

export const useResizeContent = (ref: MutableRefObject<any>) => {
  const [width, setWidth] = useState<number>(ref?.current?.clientWidth)

  const handleResizeWindow = (e: any): void =>
    setWidth(ref?.current?.clientWidth)

  useEffect(() => {
    window.addEventListener('resize', handleResizeWindow)

    return (): void => {
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [])

  useEffect(() => {
    setWidth(ref?.current?.clientWidth)
  }, [ref])

  return { width, setWidth }
}
