import { useReveal } from '../../hooks/useReveal'

const DIRECTION_OFFSET = {
  up: 'translate-y-8',
  left: '-translate-x-12',
  right: 'translate-x-12',
  none: '',
}

export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-x-0 translate-y-0 opacity-100' : `opacity-0 ${DIRECTION_OFFSET[direction]}`
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
