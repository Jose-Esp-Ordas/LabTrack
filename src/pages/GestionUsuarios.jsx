import Navbar from '@/components/Navbar'
import React from 'react'

export const GestionUsuarios = () => {
  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>
        </section>
      </div>
    </>
  )
}
