import React from 'react'
import { CirclePlus } from 'lucide-react'

export const Resultados = ({ key, material, onAdd }) => {
  if (key > 5)
    return null;

  return (
    <>
      <div className="border border-gray-300 rounded-lg p-4 m-4 shadow-md flex flex-col gap-4 w-60 bg-white items-center justify-center">
        <h4 className="text-lg font-semibold mb-2">{material.nombre}</h4>
        <button
          onClick={onAdd}
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded mt-auto cursor-pointer w-fit"
        >
          <CirclePlus size={18} className='text-white' />
        </button>
      </div>
    </>
  )
}
