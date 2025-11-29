import Navbar from '@/components/Navbar'
import React from 'react'
import { Tabs } from '@/components/Tabs'

export const AdminDashboard = () => {
  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>
          <div className=" overflow-y-scroll h-[90vh] pr-2">
            <Tabs title="Por Despachar:" items={[]} />
            <Tabs title="Por Aceptar:" items={[]} />
            <Tabs title="Próximas entregas:" items={[]} />
          </div>
        </section>
      </div>
    </>
  )
}

export default AdminDashboard