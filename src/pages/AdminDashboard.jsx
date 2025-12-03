import Navbar from '@/components/Navbar'
import { Tabs } from '@/components/Tabs'
import { BackgroundPages } from '@/components/BackgroundPages'
import React, { useEffect, useState } from 'react'
import { useSolicitud } from '@/hooks/useSolicitud'

export const AdminDashboard = () => {
  const { solicitudes } = useSolicitud();
  const [solpendientes, setSolpendientes] = useState([]);
  const [solactivas, setSolactivas] = useState([]);
  const [solporDespachar, setSolporDespachar] = useState([]);

   useEffect(() => {
      if (!solicitudes) return;
      console.log("Todas las solicitudes:", solicitudes);
      const sorted = [...solicitudes].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      setSolpendientes(sorted.filter(sol => sol.estado === "Revision"));
      setSolporDespachar(sorted.filter(sol => sol.estado === "Entrega"));
      setSolactivas(sorted.filter(sol => sol.estado === "Devolucion"));
    }, [solicitudes]);
  return (
    <>
      <div className="flex h-screen overflow-clip">
        <Navbar />
        <section className="p-6 mx-auto w-full overflow-hidden flex flex-col">
          <BackgroundPages />
          <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>
          <div className="overflow-y-scroll overflow-x-scroll pr-8 pb-8 lg:flex gap-4 flex-1">
            <Tabs title="Por Aceptar:" items={solpendientes} />
            <Tabs title="Por Despachar:" items={solporDespachar} />
            <Tabs title="Por Devolver:" items={solactivas} abierto={false} />
          </div>
        </section>
      </div>
    </>
  )
}

export default AdminDashboard