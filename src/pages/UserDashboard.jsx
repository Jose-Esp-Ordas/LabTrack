import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import { Tabs } from '@/components/Tabs'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useSolicitud } from '@/hooks/useSolicitud'
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/Firebase'

export const UserDashboard = () => {
  const { solicitudes, crearSolicitud: crearSolicitudHook } = useSolicitud();
  const { user } = useAuthContext();
  const [solpendientes, setSolpendientes] = useState([]);
  const [solactivas, setSolactivas] = useState([]);
  const [solfinalizadas, setSolfinalizadas] = useState([]);
  const [solcanceladas, setSolcanceladas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Escuchar notificaciones desde Firebase
  useEffect(() => {
    if (!user) return;
    
    const notificacionesPath = `users/${user.uid}/notificaciones`;
    const q = query(
      collection(db, notificacionesPath),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs
        .slice(0, 5)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date()
        }));
      setNotificaciones(notifs);
    }, (error) => {
      console.error("Error al obtener notificaciones:", error);
    });

    return () => unsubscribe();
  }, [user, refresh]);

  // Gestionar solicitudes
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
  }, [user, solicitudes]);

  const marcarNotificacionesComoLeidas = async () => {
    if (!user) return;
    
    const notificacionesNoLeidas = notificaciones.filter(n => !n.leido);
    
    if (notificacionesNoLeidas.length === 0) return;
    
    const promises = notificacionesNoLeidas.map(async (notif) => {
      const notifPath = `users/${user.uid}/notificaciones`;
      const docRef = doc(db, notifPath, notif.id);
      setRefresh(prev => !prev);
      return await updateDoc(docRef, { leido: true });
    });
    
    await Promise.all(promises);
  };

  return (
    <>
      <div className="flex h-screen overflow-clip">
        <Navbar 
          notificaciones={notificaciones}
          onMarcarLeidas={marcarNotificacionesComoLeidas}
        />
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
