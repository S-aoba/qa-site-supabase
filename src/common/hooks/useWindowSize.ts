import { useLayoutEffect, useState } from 'react'

export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([992, 992])
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => {
      return window.removeEventListener('resize', updateSize)
    }
  }, [])
  return size
}
