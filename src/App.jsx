import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Auth } from "./pages/Auth"
import { UserDashboard } from "./pages/UserDashboard"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminDashboard } from "./pages/AdminDashboard"
import { Solicitud } from "./pages/Solicitud"
import { Inventario } from "./pages/Inventario"
import { Metricas } from "./pages/Metricas"
import { GestionUsuarios } from "./pages/GestionUsuarios"
import { InventarioPro } from "./pages/InventarioPro"
import { MaterialProvider } from "./context/MaterialContext"

function App() {
  return (
    <>
      <AuthProvider>
        <MaterialProvider>
          <Router>
            <Routes>

              {/* Rutas públicas */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="solicitud" 
                element={
                  <ProtectedRoute>
                    <Solicitud />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/inventario" 
                element={
                  <ProtectedRoute>
                    <Inventario />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas por rol */}
              <Route 
                path="/admin/solicitudes" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/metricas" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Metricas />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/gestion-usuarios" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <GestionUsuarios />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/inventarioPro" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <InventarioPro />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas desconocidas o forzadas */}
              <Route path="*" element={<Navigate to="/Auth" replace />} />
              
            </Routes>
          </Router>
        </MaterialProvider>
      </AuthProvider>
    </>
  )
}

export default App