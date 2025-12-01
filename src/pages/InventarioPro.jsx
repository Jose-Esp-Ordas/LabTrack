import { Buscador } from '@/components/Buscador'
import { FiltroPerso } from '@/components/FiltroPerso'
import { ListaInventario } from '@/components/ListaInventario'
import Navbar from '@/components/Navbar'
import { MaterialModal } from '@/components/MaterialModal'
import { useMaterialContext } from '@/context/MaterialContext'
import { useStorage } from '@/hooks/useStorage'
import { useState, useEffect } from 'react'

export const InventarioPro = () => {
  const [filterEstado, setFilterEstado] = useState(null);
  const [filterLaboratorio, setFilterLaboratorio] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState(null);
  const [pending, setPending] = useState(false);
 
  const materialContext = useMaterialContext();
  
  if (!materialContext) {
    return <div>Cargando contexto...</div>;
  }
  
  const { addDocument, addToCollection, loading, documents, getSubcollection, updateDocument } = materialContext;
  const { uploadFile } = useStorage();
  const [materiales, setMateriales] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [queryMaterials, setQueryMaterials] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  useEffect(() => {
    let filtered = materiales;
    
    // Filtrar por estado
    if (filterEstado && filterEstado !== "Todos") {
      filtered = filtered.filter(material => {
        const instancias = material.instancias || [];
        const disponibles = instancias.filter(inst => inst.estado === "Disponible").length;
        
        if (filterEstado === "Disponible") {
          return disponibles > 0;
        }
        return instancias.some(inst => inst.estado === filterEstado);
      });
    }
    
    // Filtrar por laboratorio
    if (filterLaboratorio && filterLaboratorio !== "Todos") {
      filtered = filtered.filter(material => 
        material.laboratorio === filterLaboratorio
      );
    }
    
    // Filtrar por categoría
    if (filterCategoria && filterCategoria !== "Todos") {
      filtered = filtered.filter(material => 
        material.categorias?.includes(filterCategoria)
      );
    }
    
    setFilteredMaterials(filtered);
  }, [materiales, filterEstado, filterLaboratorio, filterCategoria]);

  useEffect(() => {
    if(!pending) return;
  }, [materiales]);
  
  // Cargar instancias para todos los materiales
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
      setMateriales(materialsData);
      
      // Extraer laboratorios únicos
      const labsUnicos = [...new Set(materialsData.map(m => m.laboratorio).filter(Boolean))];
      setLaboratorios(labsUnicos);
      
      // Extraer categorías únicas de todos los materiales
      const categsUnicas = [...new Set(
        materialsData.flatMap(m => m.categorias || [])
      )];
      setCategorias(categsUnicas);
      
      setPending(false);
    };
    
    if (documents.length > 0) {
      fetchAllInstances();
    } else {
      setMateriales([]);
      setLaboratorios([]);
      setCategorias([]);
      setPending(false);
    }
  }, [documents]);

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

        <Navbar />

        <section className="p-4 overflow-y-hidden mx-auto w-full">

          <Buscador materiales={filteredMaterials} onSearch={setQueryMaterials} />

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
            <div className='ml-auto'>
              <MaterialModal onAddMaterial={handleAddMaterial} loading={loading} />
            </div>
          </div>

          <div className="mt-6 overflow-y-auto h-[75vh]">
            {pending ? (
              <p className="text-center py-4">Cargando materiales e instancias...</p>
            ) : documents.length === 0 ? (
              <p>No hay materiales en el inventario.</p>
            ) : (
              queryMaterials.map((material) => (
                <ListaInventario
                  key={material.id}
                  material={material}
                  instancias={material.instancias || []}
                  handleEdit={handleEdit}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  )
}
