import React, { useState, useEffect } from 'react'
import { useMaterialContext } from '@/context/MaterialContext';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const ListaInventario = ({material}) => {
    const { loading, error, deleteDocument, updateDocument } = useMaterialContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [instancias, setInstancias] = useState([]);
    
    // Calcular totales y disponibles desde las instancias
    const totales = instancias.length;
    const disponibles = instancias.filter(inst => inst.estado === "disponible").length;
    
    useEffect(() => {
        // Si el material tiene subCollection, usarla
        if (material.subCollection && Array.isArray(material.subCollection)) {
            setInstancias(material.subCollection);
        }
    }, [material]);

    const handleEdit = () => {
        // Abrir modal de edición (implementar según tu UI)
        const nuevoNombre = prompt("Nuevo nombre:", material.nombre);
        if (nuevoNombre && nuevoNombre !== material.nombre) {
            updateDocument(material.id, { nombre: nuevoNombre });
        }
    }

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar "${material.nombre}"? Esto eliminará todas las instancias.`)) {
            const result = await deleteDocument(material.id);
            if (result.success) {
                alert("Material eliminado correctamente");
            } else {
                alert("Error al eliminar: " + result.error);
            }
        }
    }

  return (
    <>
        <div className='border border-gray-300 rounded-lg p-4 shadow-md mb-2'>
            <div className='flex items-center gap-4'>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition-colors cursor-pointer'
                >
                    <h3 className='text-lg font-semibold'>{material.nombre}</h3>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <div className='flex-1'>
                    <span className='font-semibold'>Categorías: </span>
                    <span>{material.categorias?.join(", ") || "Sin categorías"}</span>
                </div>
                
                <div className='flex gap-4 items-center'>
                    <div>
                        <span className='font-semibold'>Disponibles: </span>
                        <span className='text-green-600'>{disponibles}</span>
                        <span className='mx-1'>/</span>
                        <span className='font-semibold'>Totales: </span>
                        <span>{totales}</span>
                    </div>
                    
                    <button 
                        onClick={handleEdit}
                        className='p-2 hover:bg-blue-100 rounded transition-colors cursor-pointer'
                        title='Editar'
                        disabled={loading}
                    >
                        <Pencil size={18} className='text-blue-600' />
                    </button>
                    
                    <button 
                        onClick={handleDelete}
                        className='p-2 hover:bg-red-100 rounded transition-colors cursor-pointer'
                        title='Eliminar'
                        disabled={loading}
                    >
                        <Trash2 size={18} className='text-red-600' />
                    </button>
                </div>
            </div>
            
            {isExpanded && (
                <div className='mt-4 pt-4 border-t'>
                    <h4 className='font-semibold mb-2'>Instancias ({totales}):</h4>
                    {instancias.length === 0 ? (
                        <p className='text-gray-500'>No hay instancias registradas</p>
                    ) : (
                        <div className='grid grid-cols-3 gap-2'>
                            {instancias.map((inst, idx) => (
                                <div key={idx} className='p-2 bg-gray-50 rounded text-sm'>
                                    <span className='font-mono'>{inst.sku}</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                        inst.estado === "disponible" 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-gray-200 text-gray-700"
                                    }`}>
                                        {inst.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    </>
  )
}
