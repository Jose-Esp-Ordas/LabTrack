import React, { use } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useMaterialContext } from '@/context/MaterialContext';
import { useSolicitud } from '@/hooks/useSolicitud';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

export const Solicitud = ({item}) => {

    const { updateEstadoInstancia, getSubcollection } = useMaterialContext();
    const { userRole, user } = useAuthContext();
    const { actualizarEstadoSolicitud } = useSolicitud();
    
    if(!item) {
        return <div>No hay datos de solicitud disponibles.</div>;
    }

    const formatearFecha = (fecha) => {
        const date = fecha?.toDate ? fecha.toDate() : new Date(fecha);
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]}`;
    };

    const actualizarSolicitud = async (solicitudId, nuevoEstado) => {
        if (nuevoEstado === "Finalizada" || nuevoEstado === "Cancelada") {
            const promises = item.materiales.flatMap(material => 
                material.skus.map(async (sku) => {
                    // Buscar el ID de la instancia que tiene este SKU
                    const result = await getSubcollection(material.materialId, "instancias");
                    const instancia = result.documents?.find(inst => inst.sku === sku);
                    
                    if (instancia) {
                        return await updateEstadoInstancia(material.materialId, "instancias", instancia.id, "Disponible");
                    }
                    return { success: false, error: "Instancia no encontrada" };
                })
            );
            
            const results = await Promise.all(promises);
            const fallos = results.filter(r => !r.success);
            if (fallos.length > 0) {
                console.error("Algunos materiales no se pudieron actualizar:", fallos);
            }
        }
        const result = await actualizarEstadoSolicitud(solicitudId, nuevoEstado);
        if (result.success) {
            console.log("Estado actualizado correctamente");
        } else {
            alert("Error al actualizar estado: " + result.error);
        }
    }
    const actualizarUsuario = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
            const faltasActualizadas = (userDoc.data().faltas || 0) + 1;
            await updateDoc(doc(db, "users", user.uid), { faltas: faltasActualizadas });
        }
    }

  return (
    <>
        <div className='border border-gray-300 rounded-lg p-4 w-fit shadow-md flex flex-col gap-4 bg-white grow'>

            <div className="flex w-fit items-start gap-8 align-middle">
                <div>
                    <p>
                        <span className="font-semibold">Inicio: </span>{formatearFecha(item.fechaInicio)}
                    </p>
                        <span className="font-semibold">Fin: </span>{formatearFecha(item.fechaFin)}
                </div>

                {item.estado === "Devolucion" && userRole !== "admin" && (() => {
                    const fechaFinDate = item.fechaFin?.toDate ? item.fechaFin.toDate() : new Date(item.fechaFin);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    fechaFinDate.setHours(0, 0, 0, 0);
                    return fechaFinDate < hoy;
                })() && (
                    <>
                        <h4 className="text-md  mb-2 shrink-0 ">Estado: <span className='shrink-0 text-red-700 font-semibold'>{"Atrasado"}</span></h4>
                        
                    </>
                )}
                {
                    (item.estado === "Entrega" || (item.estado === "Devolucion" && userRole !== "admin" && (() => {
                        const fechaFinDate = item.fechaFin?.toDate ? item.fechaFin.toDate() : new Date(item.fechaFin);
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        fechaFinDate.setHours(0, 0, 0, 0);
                        return fechaFinDate >= hoy;
                    })())) && (
                    <>
                        <h4 className="text-md  mb-2 shrink-0">Estado: <span className='shrink-0 font-semibold'>{item.estado}</span></h4>
                        
                    </>
                )}
                <div className="flex gap-2 ml-auto">
                {userRole !== "admin" ? (
                <>
                    {/*Botones Usuario */}
                    <button
                    onClick={() => actualizarSolicitud(item.id, "Cancelada")}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Revision" ? " hidden" : "")}
                    >
                        {"Cancelar"}
                    </button>
                </>) : ( <>
                    {/*Botones Administrador */}
                    <button
                    onClick={() => actualizarSolicitud(item.id, "Devolucion")}
                    className={"bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Entrega" ? " hidden" : "")}
                    >
                        {"Despachado"}
                    </button>
                    
                    <button
                    onClick={() => actualizarSolicitud(item.id, "Entrega")}
                    className={"bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Revision" ? " hidden" : "")}
                    >
                        {"Aceptar"}
                    </button>


                    <button
                    onClick={() => actualizarSolicitud(item.id, "Cancelada")}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Revision" ? " hidden" : "")}
                    >
                        {"Denegar"}
                    </button>
                   

                    <button
                    onClick={() => actualizarSolicitud(item.id, "Finalizada")}
                    className={"bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Devolucion" ? " hidden" : "")}
                    >
                        {"Entregado"}
                    </button>

                    <button
                    onClick={() => (actualizarSolicitud(item.id, "Finalizada"), actualizarUsuario())}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"+ (item.estado !== "Devolucion" ? " hidden" : "")}
                    >
                        {"Defectuoso"}
                    </button>

                    
                </>)}
                </div>
            </div>

            <div className='flex flex-col gap-2 w-full'>
                {item.materiales.map((material, idx) => (
                    <div key={idx} className='border-t pt-2 flex gap-4 items-start min-w-[25vw] '>
                        <p className="text-md whitespace-normal break-words">
                            <span className="font-semibold">SKU: </span>
                            {material.skus.map(sku => sku).join(", ")}
                            {" "}
                            <span className="font-semibold">Material: </span>
                            {material.nombre}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}
