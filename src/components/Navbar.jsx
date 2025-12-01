import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Navlink } from "./Navlink";
 

export const Navbar = () => {
  const { user, logout, userRole } = useAuthContext();

  const navigate = useNavigate();

  const userEmailStripped = user?.email ? user.email.split('@')[0] : '';

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <nav className="bg-indigo-950 p-4 text-white flex justify-items-center gap-20 items-center h-screen w-fit flex-col">
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
              <Navlink where="/admin/inventarioPro" text={`Gestionar\n` +'Inventario'} />
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