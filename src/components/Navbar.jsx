import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Navlink } from "./Navlink";
 

export const Navbar = () => {
  const { user, logout, userRole } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const userEmailStripped = user?.email ? user.email.split('@')[0] : '';

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
      <nav className={`bg-indigo-950 p-4 text-white flex justify-items-center gap-20 items-center h-screen w-fit flex-col fixed md:relative z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div> 
          <div>
            <p className="">{"Rol: " + userRole}</p>
            <p className="">Hola {userEmailStripped}</p>
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