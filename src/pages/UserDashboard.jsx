import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import { Tabs } from '@/components/Tabs'
import React from 'react'

export const UserDashboard = () => {
  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <section className="p-4 overflow-y-hidden mx-auto w-full">
          <BackgroundPages />
          <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>
          <div className=" overflow-y-scroll h-[90vh] pr-2">
            <Tabs title="Pendientes:" items={[]} />
            <Tabs title="Activas:" items={[]} />
            <Tabs title="Finalizadas:" items={[]} abierto={false} />
          </div>
        </section>
      </div>
    </>
  )
}
