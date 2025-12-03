import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import { Tabs } from '@/components/Tabs'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useSolicitud } from '@/hooks/useSolicitud'

export const UserDashboard = () => {
  const { solicitudes, crearSolicitud: crearSolicitudHook } = useSolicitud();
  const { user } = useAuthContext();
  const [solpendientes, setSolpendientes] = useState([]);
  const [solactivas, setSolactivas] = useState([]);
  const [solfinalizadas, setSolfinalizadas] = useState([]);
  const [solcanceladas, setSolcanceladas] = useState([]);

  useEffect(() => {
    if (!user || !solicitudes) return;
    
    const misSolicitudes = solicitudes.filter(sol => sol.userId === user.uid);
    
    const sorted = [...misSolicitudes].sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    setSolpendientes(sorted.filter(sol => sol.estado === "Revision"));
    setSolactivas(sorted.filter(sol => sol.estado === "Entrega" || sol.estado === "Devolucion"));
    setSolfinalizadas(sorted.filter(sol => sol.estado === "Finalizada"));
    setSolcanceladas(sorted.filter(sol => sol.estado === "Cancelada"));
    console.log("Solicitudes del usuario actual:", solpendientes, solactivas, solfinalizadas, solcanceladas);
  }, [user, solicitudes]);

  

  return (
    <>
      <div className="flex h-screen overflow-clip">
        <Navbar />
        <section className="p-6 mx-auto w-full overflow-hidden flex flex-col">
          <BackgroundPages />
          <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>
          <div className="overflow-y-scroll overflow-x-scroll pr-8 pb-8 lg:flex flex-1">
            <Tabs title="Pendientes:" items={solpendientes} />
            <Tabs title="Activas:" items={solactivas} />
            <Tabs title="Finalizadas:" items={solfinalizadas} abierto={false} />
            <Tabs title="Canceladas:" items={solcanceladas} abierto={false} />
          </div>
        </section>
      </div>
    </>
  )
}
