import { Buscador } from '@/components/Buscador'
import Navbar from '@/components/Navbar'
import { Resultados } from '@/components/Resultados'
import { useMaterialContext } from '@/context/MaterialContext'
import { useState, useEffect } from 'react'
import React from 'react'
import { BackgroundPages } from '@/components/BackgroundPages'
import { Input } from '@/components/ui/input'
import { useSolicitud } from '@/hooks/useSolicitud'
import { useAuthContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Solicitud = () => {
  const { documents, getSubcollection, updateEstadoInstancia } = useMaterialContext()
  const { user } = useAuthContext();
  const [materiales, setMateriales] = useState([])
  const [query, setQuery] = useState('')
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [FechaInicio, setFechaInicio] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0])
  const [FechaFin, setFechaFin] = useState('')
  const { obtenerSolicitudes, crearSolicitud: crearSolicitudHook } = useSolicitud();
  const navigate = useNavigate();

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
      material.cantidad = 1;
      setFilteredMaterials(prevMaterials => [...prevMaterials, material]);
  }

  const handleRemoveFromSolicitud = (material) => {
    setFilteredMaterials(prevMaterials => prevMaterials.filter(m => m !== material));
  }

  const isInSolicitud = (material) => {
    return filteredMaterials.some(m => m.nombre === material.nombre);
  }

  const actualizarInstancias = ({matId, instId}) => {
    updateEstadoInstancia(matId, "instancias", instId, "Pendiente");
  }

  const handleCrearSolicitud = async () => {
    let solicitudes = obtenerSolicitudes(user.uid);
    
    if (solicitudes.some(solicitud => solicitud.estado === "Pendiente" || solicitud.estado === "Aprobada")) {
      alert("Ya tienes una solicitud pendiente o aprobada. No puedes crear una nueva hasta que se resuelva la actual.");
      return;
    }    

    // verificaciones
    if (filteredMaterials.length === 0) {
      alert("La solicitud debe contener al menos un material.");
      return;
    }
    if (FechaInicio > FechaFin) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return;
    }
    
    const solicitudData = {
      fechaInicio: FechaInicio,
      fechaFin: FechaFin,
      materiales: filteredMaterials.map(item => {
        // Obtener instancias disponibles según la cantidad solicitada
        const instanciasDisponibles = item.instancias
          .filter(inst => inst.estado === "Disponible")
          .slice(0, item.cantidad);
        
        // Actualizar estado de cada instancia a "Pendiente"
        instanciasDisponibles.forEach(inst => {
          actualizarInstancias({matId: item.id, instId: inst.id});
        });
        
        return {
          materialId: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          skus: instanciasDisponibles.map(inst => inst.sku)
        };
      })
    };

    const result = await crearSolicitudHook(solicitudData, user.uid);
      if (!result.success) {
        alert("Error al crear la solicitud: " + result.error);
        return;
      } else {
        setFilteredMaterials([]);
        setFechaInicio('');
        setFechaFin('');
        
        alert("Solicitud creada con éxito.");
        navigate('/dashboard');
      }
    
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
          <div className='mt-4 mb-32 border-t pt-4'>
             <div className='grid items-start gap-2 w-full min-w-0 bg-white' style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                {filteredMaterials.length > 0 ? (filteredMaterials.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <p className="min-w-0 wrap-break-word whitespace-normal text-lg">{item.nombre}</p>
                        <Input 
                          type="number"
                          className='whitespace-nowrap max-w-20 right-80 fixed'
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
                        <button
                          onClick={() => handleRemoveFromSolicitud(item)}
                          className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"}
                        >
                          Eliminar
                        </button>
                    </React.Fragment>
                ))) : <p className='text-2xl '>Empieza agregando un material</p>}
            </div>
          </div>
          <div className='fixed bottom-0 left-[12%] right-[8%] bg-slate-200 p-6 flex gap-4 min-h-[300px] pt-12' style={{clipPath: 'ellipse(70% 50% at 50% 100%)'}} >
              <div className='px-[5%] flex gap-4 w-full items-center translate-y-15'>
                <p className='text-xl font-bold w-full'>Fecha Inicio:</p>
                <Input 
                  type="date" 
                  required
                  variant="outline"
                  className='min-w[10%] mr-24 bg-white' 
                  value={FechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <p className='text-xl font-bold w-full'>Fecha Fin:</p>
                <Input 
                  type="date" 
                  required
                  variant="outline"
                  className='min-w[10%] mr-24 bg-white' 
                  value={FechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
                <button className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded ml-auto max-h-12 w-full cursor-pointer' onClick={handleCrearSolicitud}>Crear Solicitud</button>
              </div>
          </div>
        </section>
      </div>
    </>
  )
}
