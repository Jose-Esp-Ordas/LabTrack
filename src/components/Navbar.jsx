import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Navlink } from "./Navlink";
 

export const Navbar = ({ notificaciones = [], onMarcarLeidas }) => {
  const { user, logout, userRole } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const navigate = useNavigate();

  const userEmailStripped = user?.email ? user.email.split('@')[0] : '';
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leido).length;

  const handleToggleNotificaciones = () => {
    const nuevoEstado = !mostrarNotificaciones;
    setMostrarNotificaciones(nuevoEstado);
    if (nuevoEstado && onMarcarLeidas) {
      onMarcarLeidas();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-indigo-950 text-white p-3 rounded"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className={`bg-indigo-950 py-4 px-2 text-white flex justify-items-center gap-10 items-center h-screen w-fit flex-col fixed md:relative z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div> 
          <div>
            <p className="">{"Rol: " + userRole}</p>
            <p className="">Hola {userEmailStripped}</p>
            
            {/* Campana de notificaciones solo para usuarios no admin */}
            {userRole !== "admin" && (
              <div className="relative mt-3">
                <button
                  onClick={handleToggleNotificaciones}
                  className="relative bg-indigo-800 hover:bg-indigo-700 p-2 rounded-full w-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notificacionesNoLeidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificacionesNoLeidas}
                    </span>
                  )}
                </button>
                
                {/* Panel de notificaciones */}
                {mostrarNotificaciones && (
                  <div className="absolute left-full ml-2 top-0 w-72 bg-white text-black rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-bold text-sm">Notificaciones</h3>
                    </div>
                    {notificaciones.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No hay notificaciones
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {notificaciones.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 hover:bg-gray-50 ${
                              !notif.leido ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm">{notif.mensaje}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notif.timestamp.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-4 w-full cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
        {userRole === "admin" ? (
          <>
              <Navlink where="/admin/solicitudes" text={`Gestionar\n` +'Solicitudes'} />
              <Navlink where="/admin/inventario" text={`Gestionar\n` +'Inventario'} />
              <Navlink where="/admin/metricas" text={`Métricas`} />
              <Navlink where="/admin/gestion-usuarios" text={`Gestionar\n` +'Usuarios'} />
          </>
        ) : (
          <>
              <Navlink where="/dashboard" text={`Inicio`} />
              <Navlink where="/solicitud" text={`Nueva\n` +`Solicitud`} />
              <Navlink where="/inventario" text={`Lista\n` +`Materiales`} />
          </>
          )}
      </nav>
    </>
  );
};

export default Navbar;