import { Buscador } from '@/components/Buscador'
import { FiltroPerso } from '@/components/FiltroPerso'
import { ListaInventario } from '@/components/ListaInventario'
import Navbar from '@/components/Navbar'
import { MaterialModal } from '@/components/MaterialModal'
import { useMaterialContext } from '@/context/MaterialContext'
import { useAuthContext } from '@/context/AuthContext'
import { useStorage } from '@/hooks/useStorage'
import { useState, useEffect } from 'react'
import { BackgroundPages } from '@/components/BackgroundPages'

export const Inventario = () => {
  const [filterEstado, setFilterEstado] = useState(null);
  const [filterLaboratorio, setFilterLaboratorio] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState(null);
  const [pending, setPending] = useState(false);
  const { userRole } = useAuthContext();
  const { uploadFile } = useStorage();
  const { addDocument, addToCollection, loading, documents, getSubcollection, updateDocument } = useMaterialContext();
  
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  
  const [query, setQuery] = useState('');
  const [laboratorios, setLaboratorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  if (!documents) {
    return <div>Cargando materiales...</div>;
  }

  useEffect(() => {
    const fetchAllInstances = async () => {
      setPending(true);
      const materialsData = await Promise.all(
        documents.map(async (material) => {
          const result = await getSubcollection(material.id, "instancias");
          const instancias = result.documents || [];
          
          return {
            ...material,
            instancias
          };
        })
      );
      setFilteredMaterials(materialsData);
      
      // Extraer laboratorios únicos
      const labsUnicos = [...new Set(materialsData.map(m => m.laboratorio).filter(Boolean))];
      setLaboratorios(labsUnicos);
      
      // Extraer categorías únicas de todos los materiales
      const categsUnicas = [...new Set(
        materialsData.flatMap(m => m.categorias || [])
      )];
      setCategorias(categsUnicas);
      
    };
    
    if (documents.length > 0) {
      setPending(true);
      fetchAllInstances();
      let filtered = filteredMaterials;

      // Filtrar por búsqueda
      if (query.trim() !== '') {
        const lowerQuery = query.trim().toLowerCase();
        filtered = filtered.filter(material => 
          material.nombre?.toLowerCase().includes(lowerQuery)
        );
      }

      // Filtrar por estado
      if (filterEstado && filterEstado !== "Todos") {
        filtered = filtered.filter(filteredMaterials => {
          const instancias = filteredMaterials.instancias || [];
          const disponibles = instancias.filter(inst => inst.estado === "Disponible").length;
          
          if (filterEstado === "Disponible") {
            return disponibles > 0;
          }
          return instancias.some(inst => inst.estado === filterEstado);
        });
      }
      
      // Filtrar por laboratorio
      if (filterLaboratorio && filterLaboratorio !== "Todos") {
        filtered = filtered.filter(filteredMaterials => 
          filteredMaterials.laboratorio === filterLaboratorio
        );
      }
      
      // Filtrar por categoría
      if (filterCategoria && filterCategoria !== "Todos") {
        filtered = filtered.filter(filteredMaterials => 
          filteredMaterials.categorias?.includes(filterCategoria)
        );
      }

      setFilteredMaterials(filtered);
      setPending(false);

    } else {
      setMateriales([]);
      setLaboratorios([]);
      setCategorias([]);
      setPending(false);
    }
  }, [ filterEstado, filterLaboratorio, filterCategoria, query, documents]);


  return (
    <>
      <div className="flex h-screen">

        <Navbar />

        <section className="p-16 overflow-y-hidden mx-auto w-full">
          <BackgroundPages />
          <Buscador query={query} setQuery={setQuery} />

          <div className="mt-4 flex items-center gap-8">
            <p>Filtros:</p>
            <FiltroPerso 
              options={["Disponible", "Prestado", "Mantenimiento", "Pérdida", "Todos"]} 
              title="Estado" 
              onFilterChange={setFilterEstado}
            />
            <FiltroPerso 
              options={[...laboratorios, "Todos"]} 
              title="Laboratorio" 
              onFilterChange={setFilterLaboratorio}
            />
            <FiltroPerso 
              options={[...categorias, "Todos"]} 
              title="Categoría" 
              onFilterChange={setFilterCategoria}
            />
          </div>

          <div className="mt-6 overflow-y-auto h-[75vh]">
            {pending ? (
              <p className="text-center py-4">Cargando materiales e instancias...</p>
            ) : documents.length === 0 ? (
              <p>No hay materiales en el inventario.</p>
            ) : (
              filteredMaterials.map((material) => (
                <ListaInventario
                  key={material.id}
                  material={material}
                  instancias={material.instancias || []}
                  userRole={userRole}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  )
}
