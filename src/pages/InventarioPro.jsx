import { Buscador } from '@/components/Buscador'
import { FiltroPerso } from '@/components/FiltroPerso'
import { ListaInventario } from '@/components/ListaInventario'
import Navbar from '@/components/Navbar'
import { NuevoMat } from '@/components/NuevoMat'
import { useMaterialContext } from '@/context/MaterialContext'
import { doc } from 'firebase/firestore'
import React from 'react'

export const InventarioPro = () => {
  const materialContext = useMaterialContext();
  
  if (!materialContext) {
    return <div>Cargando contexto...</div>;
  }
  
  const { addDocument, addToCollection, loading, documents } = materialContext;

  const handleAddMaterial = async (materialData, childrenData) => {
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
  
  return (
    <>
      <div className="flex h-screen">

        <Navbar />

        <section className="p-4 overflow-y-hidden mx-auto w-full">

          <Buscador />

          <div className="mt-4 flex items-center gap-8">
            <p>Filtros:</p>
            <FiltroPerso options={[ "Disponibles", "No Disponibles"]} title="Estado" />
            <FiltroPerso options={["Electrónica","IA"]} title="Laboratorio" />
            <FiltroPerso options={["Ropa", "Consumible", "Electricidad"]} title="Categoría" />
            <div className='ml-auto'>
              <NuevoMat onAddMaterial={handleAddMaterial} loading={loading} />
            </div>
          </div>

          <div className="mt-6 overflow-y-auto h-[75vh]">
            {documents.length === 0 ? (
              <p>No hay materiales en el inventario.</p>
            ) : (
              documents.map((material) => (
                <ListaInventario
                  key={material.id}
                  material={material}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  )
}
