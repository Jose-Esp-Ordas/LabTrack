import { useRef, useEffect } from 'react'
import { gsap } from "gsap"

export const BackgroundPages = () => {
  const hexagonsRef = useRef([])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 })
    
    // Cada hexágono aparece y desaparece antes del siguiente
    hexagonsRef.current.forEach((hex, index) => {
      if (!hex) return
      tl.fromTo(hex, { opacity: 0, duration: 0.7, ease: "power2.in" }, { opacity: 0.6, duration: 0.7, ease: "power2.out" })
        .to({}, { duration: 0.7 }) // Pausa antes del siguiente
        .to(hex, { opacity: 0, duration: 0.7, ease: "power2.in" })
    })
    
    return () => tl.kill()
  }, [])

  // Crear un path SVG para hexágono
  const hexagonPath = "M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z"

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 w-full h-full">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        {[...Array(12)].map((_, i) => {
          const x = (i % 4) * 280 + 120
          const y = Math.floor(i / 4) * 250 + 100
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <path
                ref={(el) => (hexagonsRef.current[i] = el)}
                d={hexagonPath}
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                transform="scale(1.5)"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
