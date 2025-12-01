import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Instancias = ({inst, updateEstadoInstancia, userRole }) => {
    const [estado, setEstado] = useState(inst.estado);
    const options = {"Disponible": "text-green-600", "Prestado": "text-yellow-600", "Mantenimiento": "text-blue-600", "Pérdida": "text-red-600"};
    
    const handleEstadoChange = (newEstado) => {
        setEstado(newEstado);
        updateEstadoInstancia(inst.id, newEstado);
    };
    
  return (
    <>
        <p className='font-mono'>{inst.sku}</p>
        {userRole === "admin" && (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={" cursor-pointer " + options[estado]}>{estado}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={estado} onValueChange={handleEstadoChange}>
                    {Object.keys(options).map((option, index) => (
                        <DropdownMenuRadioItem key={index} value={option} className={"cursor-pointer " + options[option]}>{option}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        )}
        {userRole !== "admin" && (
            <p className={options[estado]}>{estado}</p>
        )}
        <p>{"Fecha de adquisición: " + (inst.addedAt?.toDate ? inst.addedAt.toDate().toLocaleDateString() : "N/A")}</p>
        <p>{"Última actualización: " + (inst.lastUpdated?.[0]?.toDate ? inst.lastUpdated[inst.lastUpdated.length - 1].toDate().toLocaleDateString() : "N/A")}</p>
    </>
  )
}
