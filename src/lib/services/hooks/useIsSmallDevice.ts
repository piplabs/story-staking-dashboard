'use client'

import { useWindowSize } from 'react-use'

export function useIsSmallDevice() {
  const size = useWindowSize()

  return size.width < 1024
}
