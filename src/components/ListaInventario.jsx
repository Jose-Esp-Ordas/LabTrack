import React, { useState, useEffect, use } from 'react'
import { useMaterialContext } from '@/context/MaterialContext';
import { Pencil, Trash2, ChevronDown, ChevronUp, CirclePlus,  } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { Button } from "@/components/ui/button"
import { MaterialModal } from '@/components/MaterialModal';
import { Instancias } from './Instancias';

export const ListaInventario = ({material, instancias, handleEdit, userRole}) => {

    const { loading, error, deleteDocument, updateEstadoInstancia } = useMaterialContext();
    const { deleteFile } = useStorage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [disponibles, setDisponibles] = useState(instancias.filter(inst => inst.estado === "Disponible").length);
    const totales = instancias.length;
    
    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar "${material.nombre}"? Esto eliminará todas las instancias.`)) {
            const result = await deleteDocument(material.id);
            if (result.success) {
                const fotod = await deleteFile('materiales', material.imageName);
                if (!fotod.success) {
                    console.error("Error al eliminar la imagen: ", fotod.error);
                }
                alert("Material eliminado correctamente");
            } else {
                alert("Error al eliminar: " + result.error);
            }
        }
    }

    const updateInstancia = async (instId, newEstado) => {
        try {
            if (newEstado === "Disponible") {
                setDisponibles(prev => prev + 1);
            } else if (instancias.find(inst => inst.id === instId).estado === "Disponible") {
                setDisponibles(prev => prev - 1);
            }
            const result = await updateEstadoInstancia(material.id, "instancias", instId, newEstado);
            if (!result.success) {
                alert("Error al actualizar estado: " + result.error);
            }
        } catch (error) {
            console.error("Error al actualizar estado: ", error);
        }
    }

    useEffect(() => {
        if (error) {
            alert("Error: " + error);
        }
    }, [error]);

  return (
    <>
        <div className='border border-gray-300 rounded-lg p-4 shadow-md mb-2'>
            <div className='flex items-center gap-4'>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition-colors cursor-pointer'
                >
                    <div>
                        <h3 className='text-lg font-semibold'>{material.nombre}</h3>
                        <p>{"Estante " + material.ubicacion.estante + " Fila " + material.ubicacion.fila}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                 <div className='flex-1'>
                    <span className='font-semibold'>Laboratorio: </span>
                    <span>{material.laboratorio || "Sin laboratorio"}</span>
                    <p>{"Fecha introducción: " + material.createdAt.toDate().toLocaleDateString()}</p>
                </div>

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
                    {userRole === "admin" && (
                        <>
                            <MaterialModal loading={loading} editMode={true} existingData={{...material,totales}} onAddMaterial={handleEdit}
                                button={
                                <Button 
                                    className='p-2 hover:bg-blue-100 rounded transition-colors cursor-pointer'
                                    title='Editar'
                                    disabled={loading}
                                    onClick={(e) => {e.stopPropagation()}}
                                >
                                    <Pencil size={18} className='text-blue-600' />
                                </Button>
                                }/>

                            <button 
                                onClick={handleDelete}
                                className='p-2 hover:bg-red-100 rounded transition-colors cursor-pointer'
                                title='Eliminar'
                                disabled={loading}
                            >
                                <Trash2 size={18} className='text-red-600' />
                            </button>
                        </>
                    )}
                    {userRole !== "admin" && (
                        <>
                        <button 
                                onClick={() => {}}
                                className='p-2 hover:bg-red-100 rounded transition-colors cursor-pointer'
                                title='add'
                                disabled={loading}
                            >
                                <CirclePlus size={18} className='text-blue-600' />
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {isExpanded && (
                <div className='mt-4 pt-4 border-t'>
                    <h4 className='font-semibold mb-2'>Instancias ({totales}):</h4>
                    {instancias.length === 0 ? (
                        <p className='text-gray-500'>No hay instancias registradas</p>
                    ) : (
                        <div className=' flex gap-2'>
                            <div className='grid grid-cols-3 gap-2 mr-2'>
                                {instancias.map((inst, idx) => (
                                    <div key={idx} className='p-2 bg-gray-50 rounded text-sm'>
                                        <Instancias inst={inst} updateEstadoInstancia={updateInstancia} userRole={userRole} />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <img src={material.imagenURL} alt={material.nombre} className="mt-4 max-w-xs rounded" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </>
  )
}
