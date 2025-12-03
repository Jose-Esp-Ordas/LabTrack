import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import { useMaterialContext } from '@/context/MaterialContext'
import { useSolicitud } from '@/hooks/useSolicitud'
import { useEffect, useState } from 'react'
import { db } from '../firebase/Firebase'
import { collection, getDocs } from 'firebase/firestore'

export const Metricas = () => {
  const { documents: materiales } = useMaterialContext();
  const { solicitudes } = useSolicitud();
  
  const [materialesMasSolicitados, setMaterialesMasSolicitados] = useState([]);
  const [alumnosMasSolicitan, setAlumnosMasSolicitan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularMetricas = async () => {
      setLoading(true);
      
      if (!solicitudes || solicitudes.length === 0) {
        setLoading(false);
        return;
      }

      // Contar materiales más solicitados
      const materialesCount = {};
      
      solicitudes.forEach(solicitud => {
        if (solicitud.materiales && Array.isArray(solicitud.materiales)) {
          solicitud.materiales.forEach(material => {
            const materialId = material.materialId;
            const nombreMaterial = material.nombre;
            
            if (!materialesCount[materialId]) {
              materialesCount[materialId] = {
                nombre: nombreMaterial,
                cantidad: 0
              };
            }
            materialesCount[materialId].cantidad += material.skus?.length || 1;
          });
        }
      });

      const materialesArray = Object.values(materialesCount)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10); 
      
      setMaterialesMasSolicitados(materialesArray);

      const alumnosCount = {};
      
      // Obtener información de usuarios
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersMap = {};
      usersSnapshot.forEach(doc => {
        usersMap[doc.id] = doc.data().email;
      });

      solicitudes.forEach(solicitud => {
        const userId = solicitud.userId;
        const userEmail = usersMap[userId] || "Usuario desconocido";
        
        if (!alumnosCount[userId]) {
          alumnosCount[userId] = {
            email: userEmail,
            cantidad: 0
          };
        }
        alumnosCount[userId].cantidad += 1;
      });

      // Convertir a array y ordenar por cantidad
      const alumnosArray = Object.values(alumnosCount)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10); // Top 10
      
      setAlumnosMasSolicitan(alumnosArray);
      setLoading(false);
    };

    calcularMetricas();
  }, [materiales, solicitudes]);

  return (
    <>
      <div className="flex h-screen">
        <BackgroundPages />
        <Navbar />
        
        <section className="px-10 py-6 overflow-y-auto mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Métricas del Sistema</h1>
          
          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Cargando métricas...</p>
            </div>
          ) : (
            <>
              {/* Materiales Más Solicitados */}
              <div className="grid grid-cols-2 gap-8">
              <aside>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Materiales Más Solicitados</h2>
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                  {materialesMasSolicitados.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="pb-3 pt-2 px-4 text-base font-semibold text-gray-800">Material</th>
                            <th className="pb-3 pt-2 px-4 text-base font-semibold text-gray-800 text-right">Cantidad de Solicitudes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materialesMasSolicitados.map((material, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-4 px-4 font-medium text-gray-800">{material.nombre}</td>
                              <td className="py-4 px-4 text-indigo-600 font-bold text-right text-lg">{material.cantidad}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay datos de materiales solicitados</p>
                  )}
                </div>
              </aside>

              {/* Alumnos que Más Solicitan */}
              <aside>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Alumnos que Más Solicitan</h2>
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                  {alumnosMasSolicitan.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="pb-3 pt-2 px-4 text-base font-semibold text-gray-800">Alumno</th>
                            <th className="pb-3 pt-2 px-4 text-base font-semibold text-gray-800 text-right">Número de Solicitudes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alumnosMasSolicitan.map((alumno, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-4 px-4 font-medium text-gray-800">
                                {alumno.email.split('@')[0]}
                              </td>
                              <td className="py-4 px-4 text-blue-600 font-bold text-right text-lg">{alumno.cantidad}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay datos de alumnos</p>
                  )}
                </div>
              </aside>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}