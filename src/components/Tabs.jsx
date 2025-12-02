import React from 'react'
import { useState } from 'react'
import { Solicitud } from './Solicitud'

export const Tabs = ({title, abierto=true, items=[], }) => {
    const [active, setActive] = useState(abierto);
  return (
    <>
        <div className={"mb-4 border-b border-gray-200 bg-white cursor-pointer border-t border-t-blue-950 w-full px-auto" + (!active && " bg-stone-100" )}>
            <div  onClick={() => setActive(!active)}>
                <div className="flex justify-between items-center p-4">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <span className="text-sm text-gray-500">{items.length} solicitudes</span>
                    <span className="float-right">{active ? '▲' : '▼'}</span>
                </div>
            </div>
            <div className={(active ? '' : 'hidden ') + "gap-4 transition-discrete duration-300 p-4 cursor-default"}>
                <Solicitud />
            </div>
        </div>
    </>
  )
}
