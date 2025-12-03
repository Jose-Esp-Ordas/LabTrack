import { useFirestore } from "./useFirestore";

export const useSolicitud = () => {
    const { addDocument, updateDocument, documents, loading, error } = useFirestore("solicitudes");

    const crearSolicitud = async (solicitudData, userId) => {
        const result = await addDocument({
            ...solicitudData,
            userId: userId,
            estado: "Revision",
        });
        return result;
    };

    const actualizarEstadoSolicitud = async (solicitudId, nuevoEstado) => {
        const result = await updateDocument(solicitudId, {
            estado: nuevoEstado,
            updatedAt: new Date()
        });
        return result;
    };

    const obtenerSolicitudes = (userId = null) => {
        if (userId) {
            // Filtrar por usuario específico
            return documents.filter(doc => doc.userId == userId);
        }
        // Retornar todas las solicitudes
        return documents;
    };

    return { 
        crearSolicitud, 
        actualizarEstadoSolicitud, 
        obtenerSolicitudes, 
        solicitudes: documents,
        loading, 
        error 
    };
};