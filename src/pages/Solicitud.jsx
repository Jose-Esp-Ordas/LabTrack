import { Buscador } from '@/components/Buscador'
import Navbar from '@/components/Navbar'
import { Resultados } from '@/components/Resultados'
import { useMaterialContext } from '@/context/MaterialContext'
import { useState, useEffect } from 'react'
import React from 'react'
import { BackgroundPages } from '@/components/BackgroundPages'
import { Input } from '@/components/ui/input'

export const Solicitud = () => {
  const { documents, getSubcollection } = useMaterialContext()
  const [materiales, setMateriales] = useState([])
  const [query, setQuery] = useState('')
  const [filteredMaterials, setFilteredMaterials] = useState([{}])
  const [FechaInicio, setFechaInicio] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0])
  const [FechaFin, setFechaFin] = useState('')

  useEffect(() => {
    const fetchAllInstances = async () => {
      const materialsData = await Promise.all(
        documents.map(async (material) => {
          const result = await getSubcollection(material.id, "instancias");
          const instancias = result.documents || [];
          material.disponible = instancias.filter(instancia => instancia.estado === "Disponible").length;
          if (material.disponible > 0) {
            return {
              ...material,
              instancias
            };
          }
        })
      );
      setMateriales(materialsData.filter(material => material !== undefined));
    };

    if (documents.length > 0) {
      fetchAllInstances();
      if (query.trim() !== '') {
        const filtered = documents.filter((material) =>
          material.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setMateriales(filtered);
      } 
    }


  }, [documents, query]);

  if (!documents) {
    return <div>Cargando materiales...</div>;
  }

  const handleAddToSolicitud = (material) => {
    if (isInSolicitud(material))
      return;
      setFilteredMaterials(prevMaterials => [...prevMaterials, material]);
  }

  const handleRemoveFromSolicitud = (material) => {
    setFilteredMaterials(prevMaterials => prevMaterials.filter(m => m.material !== material));
  }

  const isInSolicitud = (material) => {
    return filteredMaterials.some(m => m.material === material);
  }

  const crearSolicitud = () => {
    // Lógica para crear la solicitud
    console.log("Solicitud creada con los siguientes materiales:", filteredMaterials);
  }

  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="pt-8 px-14 overflow-y-hidden mx-auto w-full">
          <BackgroundPages />
          <h3 className="text-3xl font-bold mb-4">Búsqueda de material:</h3>
          <Buscador query={query} setQuery={setQuery} />
          <div className='flex gap-2'>
            {materiales.map((material, index) => (
              <Resultados key={index} index={index} material={material} onAdd={() => handleAddToSolicitud(material)} />
            ))}
          </div>
          <div>
             <div className='grid items-start gap-2 w-full min-w-0' style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                {filteredMaterials[0].nombre ? (filteredMaterials.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <p className="min-w-0 wrap-break-word whitespace-normal">{item.nombre}</p>
                        <Input 
                          type="number"
                          className='whitespace-nowrap max-w-20'
                          value={item.cantidad}
                          min={1}
                          max={item.disponible}
                          onChange={(e) => {
                            const newCantidad = Math.min(Math.max(1, parseInt(e.target.value) || 1), item.disponible);
                            setFilteredMaterials(prevMaterials => {
                              const updatedMaterials = [...prevMaterials];
                              updatedMaterials[idx].cantidad = newCantidad;
                              return updatedMaterials;
                            }
                          )}}
                        />
                    </React.Fragment>
                ))) : <p>No hay materiales en la solicitud.</p>}
            </div>
          </div>
          <div className='fixed bottom-0 left-[12%] right-[8%] bg-slate-200 p-6 flex gap-4 min-h-[300px] pt-12' style={{clipPath: 'ellipse(70% 50% at 50% 100%)'}} >
              <div className='px-[5%] flex gap-4 w-full items-center translate-y-15'>
                <p className='text-xl font-bold w-full'>Fecha Inicio:</p>
                <Input 
                  type="date" 
                  className='min-w[10%] mr-24' 
                  value={FechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <p className='text-xl font-bold w-full'>Fecha Fin:</p>
                <Input 
                  type="date" 
                  className='min-w[10%] mr-24' 
                  value={FechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
                <button className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded ml-auto max-h-12 w-full cursor-pointer' onClick={crearSolicitud}>Crear Solicitud</button>
              </div>
          </div>
        </section>
      </div>
    </>
  )
}
