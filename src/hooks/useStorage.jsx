import { useState } from "react";
import { storage } from "../firebase/Firebase";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage";

export const useStorage = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileURL, setFileURL] = useState(null);
    

    const uploadFile = async (file, path) => {
        try {
            setLoading(true);
            setError(null);
            const storageRef = ref(storage, `${path}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setFileURL(downloadURL);
            setLoading(false);
            return { success: true, url: downloadURL };
        } catch (err) {
            setError(err);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };


    //subir con progreso
    const uploadFileWithProgress = (file, path, onComplete) => {
        setLoading(true);
        setError(null);
        const storageRef = ref(storage, `${path}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (err) => {
                setError(err);
                setLoading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setFileURL(downloadURL);
                    setLoading(false);
                    setUploadProgress(0);
                    if (onComplete) onComplete({ success: true, url: downloadURL });
                } catch (err) {
                    setError(err);
                    setLoading(false);
                    if (onComplete) onComplete({ success: false, error: err.message });
                }
            }
        );
    };

    //Borrar archivo
    const deleteFile = async (path, fileName) => {
        try {
            const fileRef = ref(storage, `${path}/${fileName}`);
            await deleteObject(fileRef);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    //Listar archivos de una carpeta
    const listFiles = async (path) => {
        try {
            const listRef = ref(storage, path);
            const res = await listAll(listRef);
            const files = await Promise.all(
                res.items.map(async (itemRef) => {
                    name: itemRef.name;
                    fullpath: itemRef.fullPath;
                    url: await getDownloadURL(itemRef)
                })
            );
            return { success: true, files };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return { uploadProgress, error, loading, fileURL, uploadFile, uploadFileWithProgress, deleteFile, listFiles };
};