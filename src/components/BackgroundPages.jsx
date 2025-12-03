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

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 w-full h-full">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {[...Array(12)].map((_, i) => {
          const x = (i % 4) * 280 + 120
          const y = Math.floor(i / 4) * 250 + 100
          const rotation = i * 15
          return (
            <g key={i} ref={(el) => (hexagonsRef.current[i] = el)} transform={`translate(${x}, ${y}) rotate(${rotation} 50 50) scale(1.5)`} opacity="0">
              {/* Hexágono base */}
              <path
                d="M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z"
                fill="none"
                stroke="url(#hexGradient)"
                strokeWidth="2.5"
              />
              {/* Picos puntiagudos saliendo de cada vértice */}
              <line x1="50" y1="0" x2="50" y2="-15" stroke="#818cf8" strokeWidth="2" />
              <line x1="93.3" y1="25" x2="108" y2="18" stroke="#818cf8" strokeWidth="2" />
              <line x1="93.3" y1="75" x2="108" y2="82" stroke="#818cf8" strokeWidth="2" />
              <line x1="50" y1="100" x2="50" y2="115" stroke="#818cf8" strokeWidth="2" />
              <line x1="6.7" y1="75" x2="-8" y2="82" stroke="#818cf8" strokeWidth="2" />
              <line x1="6.7" y1="25" x2="-8" y2="18" stroke="#818cf8" strokeWidth="2" />
              {/* Picos adicionales más pequeños en los puntos medios */}
              <line x1="71.65" y1="12.5" x2="80" y2="5" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
              <line x1="93.3" y1="50" x2="105" y2="50" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
              <line x1="71.65" y1="87.5" x2="80" y2="95" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
              <line x1="28.35" y1="87.5" x2="20" y2="95" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
              <line x1="6.7" y1="50" x2="-5" y2="50" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
              <line x1="28.35" y1="12.5" x2="20" y2="5" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
