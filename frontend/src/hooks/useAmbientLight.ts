import { useEffect } from 'react'

export function useAmbientLight (selector: string = ':root') {
  useEffect(() => {
    const root = document.querySelector(selector) as HTMLElement | null
    if (!root) return

    const updateShadow = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window
      const xRatio = (event.clientX / innerWidth) * 2 - 1
      const yRatio = (event.clientY / innerHeight) * 2 - 1
      const multiplier = 14
      root.style.setProperty('--shadow-x', `${Math.round(multiplier * xRatio)}px`)
      root.style.setProperty('--shadow-y', `${Math.round(multiplier * yRatio)}px`)
    }

    const resetShadow = () => {
      root.style.setProperty('--shadow-x', '12px')
      root.style.setProperty('--shadow-y', '12px')
    }

    window.addEventListener('pointermove', updateShadow)
    window.addEventListener('pointerleave', resetShadow)

    return () => {
      window.removeEventListener('pointermove', updateShadow)
      window.removeEventListener('pointerleave', resetShadow)
    }
  }, [selector])
}
