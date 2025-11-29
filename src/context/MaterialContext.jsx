import { useFirestore } from "@/hooks/useFirestore";
import { useContext, createContext } from "react";

const MaterialContext = createContext();

export const useMaterialContext = () => {
    const context = useContext(MaterialContext);
    if (!context) {
        throw new Error("useMaterialContext must be used within a MaterialProvider");
    }
    return context;
};

export const MaterialProvider = ({ children }) => {
    const material = useFirestore("materiales");
    return (
        <MaterialContext.Provider value={material}>
            {children}
        </MaterialContext.Provider>
    );
};
