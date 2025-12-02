import {useRef, useEffect} from 'react'
import { gsap } from "gsap";

export const Background = () => {
    const circlesRef = useRef([]);
    const titleRef = useRef(null);

    useEffect(() => {
        // Animación en cascada de los círculos y el título
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        
        // Animar cada círculo con un delay escalonado
        circlesRef.current.forEach((circle, index) => {
            tl.fromTo(
                circle,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 0.8, duration: 0.6, ease: "back.out(1.7)" },
                index * 0.15
            );
        });
        
        // Animar el título después de los círculos
        tl.fromTo(
            titleRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            0.75
        );
        
        // Mantener visible por un tiempo
        tl.to({}, { duration: 2 });
        
        // Desvanecer todo en cascada
        circlesRef.current.forEach((circle, index) => {
            tl.to(
                circle,
                { scale: 0, opacity: 0, duration: 0.4, ease: "power2.in" },
                `>-${0.3 - index * 0.05}`
            );
        });
        
        tl.to(titleRef.current, { y: 50, opacity: 0, duration: 0.6, ease: "power2.in" }, "<");
        
        return () => tl.kill();
    }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    {/* Círculos animados concéntricos */}
                    {[...Array(5)].map((_, i) => {
                        const angle = (i * 72) * (Math.PI / 180); // 360/5 = 72 grados entre círculos
                        const radius = 225; // Radio de la órbita
                        return (
                            <div
                                key={i}
                                ref={(el) => (circlesRef.current[i] = el)}
                                className="absolute rounded-full bg-linear-to-br from-indigo-300 to-indigo-700"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    opacity: 0,
                                    right: `calc(50% + ${Math.cos(angle) * radius}px - ${5*i}px)`,
                                    bottom: `calc(50% + ${Math.sin(angle) * radius}px - ${20*i}px)`,
                                }}
                            />
                        );
                    })}
                {/* Título con efecto de fade-in */}
                <h2 
                    ref={titleRef}
                    className="text-6xl font-extrabold bg-linear-to-r from-indigo-500 to-indigo-800 bg-clip-text text-transparent relative z-10 opacity-0 mr-24"
                >
                    LabTrack
                </h2>
    </div>
  )
}
