import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import React from 'react'

export const Metricas = () => {
  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <BackgroundPages />
          <h1 className="text-3xl font-bold mb-4">Métricas</h1>
          <div>
            {/* Contenido de métricas aquí */}
          </div>
        </section>
      </div>
    </>
  )
}
