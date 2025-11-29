import { useState, useEffect } from "react";
import { 
    collection,
    query,
    onSnapshot,
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    orderBy,
} from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { Lasso } from "lucide-react";

// @param {string} collectionName - Nombre de la colección de Firestore
export const useFirestore = (collectionName) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Leer documentos en tiempo real
    useEffect(() => {
        if (!collectionName){
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, collectionName),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setDocuments(docs);
            setLoading(false);
            setError(null);
        },
        (err) => {
            console.error("Error al obtener documentos: ", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    // Agregar un nuevo documento
    const addDocument = async (data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error("Error al agregar documento: ", err);
            return { success: false, error: err.message };
        }
    };
    // Eliminar un documento
    const deleteDocument = async (id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return { success: true };
        } catch (err) {
            console.error("Error al eliminar documento: ", err);
            return { success: false, error: err.message };
        }
    };
    // Terminar una tarea  
    const updateDocument = async (id, state) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, { completed: state });
            return { success: true };
        } catch (err) {
            console.error("Error al actualizar documento: ", err);
            return { success: false, error: err.message };
        }
    };

    //agregar a coleccion
    const addToCollection = async (data) => {
        try {
            let path = collectionName+"/"+data.parentId+"/"+data.subCollection;
            const docRef = await addDoc(collection(db, path), {
                sku: data.sku,
                lastUpdated: data.lastUpdated,
                addedAt: new Date(),
                estado: "disponible",
            });
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error("Error al agregar a colección: ", err);
            return { success: false, error: err.message };
        }
    };

    // obtener subcolección
    const getSubcollection = async (parentId, subCollectionName) => {
        try {
            let path = collectionName+"/"+parentId+"/"+subCollectionName;
            const q = query(
                collection(db, path),
                orderBy("addedAt", "desc")
            );
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            return { success: true, documents: docs };
        } catch (err) {
            console.error("Error al obtener subcolección: ", err);
            return { success: false, error: err.message };
        }
    };

    //Editar en subcolección
    const updateInSubcollection = async (parentId, subCollectionName, docId, data) => {
        try {
            let path = collectionName+"/"+parentId+"/"+subCollectionName;
            const docRef = doc(db, path, docId);
            await updateDoc(docRef, data);
            return { success: true };
        } catch (err) {
            console.error("Error al actualizar en subcolección: ", err);
            return { success: false, error: err.message };
        }
    };

    return { documents, loading, error, addDocument, deleteDocument, updateDocument, addToCollection, getSubcollection, updateInSubcollection };
    
};