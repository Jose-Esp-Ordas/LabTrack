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

export const Instancias = ({inst, updateEstadoInstancia}) => {
    const [estado, setEstado] = useState(inst.estado);
    const options = {"Disponible": "text-green-600", "Prestado": "text-yellow-600", "Mantenimiento": "text-blue-600", "Pérdida": "text-red-600"};
    
    useEffect(() => {
        if (inst.estado !== estado) {
            updateEstadoInstancia(inst.id, estado);
        }
    }, [estado]);

  return (
    <>
        <p className='font-mono'>{inst.sku}</p>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={" cursor-pointer " + options[estado]}>{estado}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={estado} onValueChange={setEstado}>
                    {Object.keys(options).map((option, index) => (
                        <DropdownMenuRadioItem key={index} value={option} className={"cursor-pointer " + options[option]}>{option}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}
