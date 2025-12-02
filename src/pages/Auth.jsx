import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Background } from "@/components/Background";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registerMode, setRegisterMode] = useState(false);
    const { login, userRole, Register } = useAuthContext();
    const navigate = useNavigate();
    const [pendingRedirect, setPendingRedirect] = useState(false);
    

    useEffect(() => {
        if (!pendingRedirect) return;
        if (!userRole) return; // Espera a que el rol esté disponible
        navigate(userRole === "admin" ? "/admin/solicitudes" : "/dashboard");
        setPendingRedirect(false);
    }, [pendingRedirect, userRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            let response;
            if (!registerMode) {
                response = await login(email, password);
            } else {
                if (password !== passwordConfirm) {
                    setError("Las contraseñas no coinciden");
                    return;
                }
                if (password.length < 6) {
                    setError("La contraseña debe tener al menos 6 caracteres");
                    return;
                }
                if (!email.includes("@") || !email.includes(".")) {
                    setError("El correo electrónico no es válido");
                    return;
                }
                response = await Register(email, password);
            }
            if (response.success) {
                // Espera a que el contexto actualice userRole y luego redirige
                setPendingRedirect(true);
            } else {
                setError(response.error || "Error inesperado");
            }
        } catch (err) {
            setError(err.message || "Error inesperado");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
        <div className=" flex h-screen align-middle items-center text-center">
            <div className="w-3/12 mt-10 p-6 border border-gray-300 rounded-lg shadow-md items-center mx-auto">
                <h2 className={"text-2xl font-bold mb-0 text-center " + (registerMode && "mr-20")}>{registerMode ? "Un registro," :"Inicio de Sesión"}</h2>
                <span className="text-2xl font-bold mb-6 text-center ml-20">{registerMode? "una experiencia": ""}</span>
                <div>
                    <span className="text-md font-medium mb-6 text-center">{registerMode ? "Volver a:"  : "Si no cuentas con un perfil"}</span>
                    <span
                        className="text-md font-medium mb-6 text-center text-indigo-600 cursor-pointer"
                        onClick={() => setRegisterMode(!registerMode)}
                    >
                        {" "}{registerMode ? "Inicio de Sesión" : "Regístrate Aquí"}
                    </span>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold" htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        />  
                    </div>
                    <div className={'mb-6'+(registerMode ? '' : ' hidden')}>
                        <label className="block mb-2 font-semibold" htmlFor="password">Repetir Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required={registerMode}
                        />  
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
            <div className="w-1/2 text-left relative h-200 flex items-center">
                <Background />
            </div>
        </div>
        </>
    );
};

export default Auth;   