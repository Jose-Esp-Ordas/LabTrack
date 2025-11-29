import { Buscador } from '@/components/Buscador'
import { FiltroPerso } from '@/components/FiltroPerso'
import Navbar from '@/components/Navbar'
import { NuevoMat } from '@/components/NuevoMat'
import { Filter } from 'lucide-react'
import React from 'react'

export const InventarioPro = () => {
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
              <NuevoMat/>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
