import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx"

/* 
ProtectedRoute component to guard routes that require authentication
HOC (Higher Order Component) that checks if the user is authenticated
*/

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user,loading,userRole } = useAuthContext();
    
    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (requireAdmin && userRole !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}