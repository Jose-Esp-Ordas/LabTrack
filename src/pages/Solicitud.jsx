import { Buscador } from '@/components/Buscador'
import Navbar from '@/components/Navbar'
import { Resultados } from '@/components/Resultados'
import { useMaterialContext } from '@/context/MaterialContext'
import { useState, useEffect } from 'react'

export const Solicitud = () => {
  const { documents } = useMaterialContext()
  const [materiales, setMateriales] = useState([])

  useEffect(() => {
    setMateriales(documents);
  }, [documents]);

  if (!documents) {
    return <div>Cargando materiales...</div>;
  }

  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <h3 className="text-3xl font-bold mb-4">Búsqueda de material:</h3>
          <Buscador materiales={materiales} onSearch={setMateriales} />
          <Resultados />
          <div>
             <div className='grid items-start gap-2 w-full min-w-0' style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">SKU:</h4>
                <h4 className="text-lg font-semibold mb-2">Material:</h4>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">Cantidad:</h4>
                
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
