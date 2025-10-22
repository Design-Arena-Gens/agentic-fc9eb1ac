import { useEffect, useRef } from 'react'
import clsx from 'clsx'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal ({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add('visible')
        }
      })
    }, {
      threshold: 0.2
    })

    const timer = setTimeout(() => {
      observer.observe(element)
    }, delay)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [delay])

  return (
    <div ref={ref} className={clsx('fade-rise', className)}>
      {children}
    </div>
  )
}
