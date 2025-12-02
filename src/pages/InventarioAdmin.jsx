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

export const InventarioAdmin = () => {
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


  const handleAddMaterial = async (materialData, childrenData, imagen) => {
    // Verificar si ya existe un material con el mismo nombre
    const nombreNormalizado = materialData.nombre.trim().toLowerCase();
    const duplicado = documents.find(
      doc => doc.nombre?.trim().toLowerCase() === nombreNormalizado
    );
    
    if (duplicado) {
      alert(`Ya existe un material con el nombre "${materialData.nombre}". Por favor, usa un nombre diferente.`);
      return { success: false, error: "Material duplicado" };
    }
    
    let result = await addDocument(materialData);
    
    if (result.success) {
      // añadir imagen si existe
      if (imagen) {
        const uploadResult = await uploadFile(imagen, 'materiales');
        if (uploadResult.success) {
          // actualizar documento con la URL de la imagen
          await materialContext.updateDocument(result.id, {"imagenURL": uploadResult.url});
        } else {
          console.error("Error al subir la imagen: ", uploadResult.error);
          return { success: false, error: "Error al subir la imagen" };
        }
      }
      
      
      
      // Crear instancias individuales con SKU personalizado
      const promises = [];
      
      for (let i = 1; i <= childrenData.cantidad; i++) {
        const sku = `${result.id}-${String(i).padStart(3, '0')}`;
        const instanciaData = {
          parentId: result.id,
          subCollection: "instancias",
          sku: sku,
        };
        promises.push(addToCollection(instanciaData));
      }
      
      // Esperar a que todas las instancias se creen
      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        alert("Material y sus instancias creadas exitosamente.");
        return { success: true, materialId: result.id };
      } else {
        return { success: false, error: "Algunas instancias no se pudieron crear" };
      }
    } else {
      return { success: false, error: result.error };
    }
  };
  
  const handleEdit = async (payload) => {
        if (payload.imagen) {
            // Si hay una nueva imagen, subirla y obtener la URL
            const uploadResult = await uploadFile(payload.imagen, 'materiales');
            if (uploadResult.success) {
                payload.materialData.imagenURL = uploadResult.url;
            } else {
                alert("Error al subir la imagen: " + uploadResult.error);
                return;
            }
        }
        if (payload.cantidad) {
            // Crear instancias individuales con SKU personalizado
            const promises = [];
            
            for (let i = 1; i <= payload.cantidad.extras; i++) {
                const sku = `${ payload.id}-${String(i+payload.cantidad.antes).padStart(3, '0')}`;
                const instanciaData = {
                parentId: payload.id,
                subCollection: "instancias",
                sku: sku,
                };
                promises.push(addToCollection(instanciaData));
            }
            
            // Esperar a que todas las instancias se creen
            const results = await Promise.all(promises);
                
        }
  
        const result = await updateDocument(payload.id, {...payload.materialData});
        if (result.success) {
            alert("Material actualizado correctamente");
        } else {
            alert("Error al actualizar material: " + result.error);
        }
  };

  return (
    <>
      <div className="flex h-screen">
        <BackgroundPages />
        <Navbar />

        <section className="p-4 overflow-y-hidden mx-auto w-full">

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
            {userRole === "admin" && (
              <div className='ml-auto'>
                <MaterialModal onAddMaterial={handleAddMaterial} loading={loading} />
              </div>
            )}
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
                  handleEdit={handleEdit}
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

