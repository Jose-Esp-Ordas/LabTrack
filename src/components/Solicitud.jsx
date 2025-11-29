import React, { use } from 'react'
import { useAuthContext } from '@/context/AuthContext'

export const Solicitud = ({FechaI = "Lunes 12:30 pm", FechaF="Lunes 12:30 pm", Estado="devolucion", 
    Materiales=[{
        sku:"sas",
        nombre:"nombre material nombre material nombre material nombre materialnombre material",
        cantidad: 5
    }]}) => {

        const { userRole } = useAuthContext();
  return (
    <>
        <div className='border border-gray-300 rounded-lg p-4 shadow-md flex flex-col gap-4'>

            <div className="flex w-full items-start gap-8 min-w-0 align-middle">
                <h4 className="text-lg font-semibold mb-2 shrink-0">Fecha Inicio</h4>
                <p className='shrink-0'>{FechaI}</p>
                <h4 className="text-lg font-semibold mb-2 shrink-0">Fecha Fin</h4>
                <p className='shrink-0'>{FechaF}</p>
                <h4 className="text-lg font-semibold mb-2 shrink-0">Estado</h4>
                <p className='shrink-0'>{Estado}</p>
                {userRole !== "admin" ? (
                <>
                    {/*Botones Usuario */}
                    <button
                    onClick={() => {}}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "revision" ? " hidden" : "")}
                    >
                        {"Cancelar"}
                    </button>
                </>) : ( <>
                    {/*Botones Administrador */}
                    <button
                    onClick={() => {}}
                    className={"bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "entrega" ? " hidden" : "")}
                    >
                        {"Despachado"}
                    </button>

                    <button
                    onClick={() => {}}
                    className={"bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "revision" ? " hidden" : "")}
                    >
                        {"Aceptar"}
                    </button>


                    <button
                    onClick={() => {}}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "revision" ? " hidden" : "")}
                    >
                        {"Denegar"}
                    </button>

                    <button
                    onClick={() => {}}
                    className={"bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "devolucion" ? " hidden" : "")}
                    >
                        {"Entregado"}
                    </button>

                    <button
                    onClick={() => {}}
                    className={"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-auto cursor-pointer"+ (Estado !== "devolucion" ? " hidden" : "")}
                    >
                        {"Defectuoso"}
                    </button>
                </>)}
            </div>

            <div className='grid items-start gap-2 w-full min-w-0' style={{ gridTemplateColumns: 'max-content 1fr max-content' }}>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">SKU:</h4>
                <h4 className="text-lg font-semibold mb-2">Material:</h4>
                <h4 className="text-lg font-semibold mb-2 whitespace-nowrap">Cantidad:</h4>
                {Materiales.map((material, idx) => (
                    <React.Fragment key={idx}>
                        <p className="whitespace-nowrap">{material.sku}</p>
                        <p className="min-w-0 wrap-break-word whitespace-normal">{material.nombre}</p>
                        <p className="whitespace-nowrap">{material.cantidad}</p>
                    </React.Fragment>
                ))}
            </div>
        </div>
    </>
  )
}
