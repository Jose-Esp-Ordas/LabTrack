import { Buscador } from '@/components/Buscador'
import Navbar from '@/components/Navbar'
import { Resultados } from '@/components/Resultados'
import { useState } from 'react'

export const Solicitud = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [resultados, setResultados] = useState([])
  const [FechaI, setFechaI] = useState('')
  const [FechaF, setFechaF] = useState('')
  const [Materiales, setMateriales] = useState([])

  const handleSearch = () => {
    // Lógica de búsqueda aquí
  }

  const actualizarMateriales = (nuevosMateriales) => {
    setMateriales(nuevosMateriales)
  }

  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <h3 className="text-3xl font-bold mb-4">Búsqueda de material:</h3>
          <Buscador />
          <Resultados />
          <div>
             <div className='grid items-start gap-2 w-full min-w-0' style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">SKU:</h4>
                <h4 className="text-lg font-semibold mb-2">Material:</h4>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">Cantidad:</h4>
                {Materiales.map((material, idx) => (
                    <React.Fragment key={idx}>
                        <p className="whitespace-nowrap">{material.sku}</p>
                        <p className="min-w-0 wrap-break-word whitespace-normal">{material.nombre}</p>
                        <p className="whitespace-nowrap">{material.cantidad}</p>
                    </React.Fragment>
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
