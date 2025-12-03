import React from 'react'
import { useState } from 'react'
import { Solicitud } from './Solicitud'

export const Tabs = ({title, abierto=true, items=[], }) => {
    const [active, setActive] = useState(abierto);
  return (
    <>
        <div className={"mb-4 rounded-2xl cursor-pointer w-fit px-auto" }>
            <div  onClick={() => setActive(!active)}>
                <div className="flex justify-between items-center p-4">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <span className="text-sm text-gray-500 min-w-20 mx-4">{items.length} solicitudes</span>
                    <span className="float-right">{active ? '▲' : '▼'}</span>
                </div>
            </div>
            <div className={(active ? '' : 'hidden ') + "gap-4 transition-discrete duration-300 p-4 cursor-default"}>
                {items.length === 0 ? (<p className='text-gray-500'>No hay solicitudes para mostrar</p>
                ) : (
                items.map((item, idx) => (
                     <div key={idx}>
                        <Solicitud item={item} />
                    </div>
                ))
                )}      
            </div>
        </div>
    </>
  )
}
