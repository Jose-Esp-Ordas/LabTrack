import {useState} from 'react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const FiltroPerso = ({options = ["Filter"], title = "Filtro", onFilterChange}) => {
    const [filter, setFilter] = useState(title)
    
    const handleFilterChange = (value) => {
      setFilter(value);
      if (onFilterChange) {
        onFilterChange(value);
      }
    };
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={" text-black cursor-pointer"}>{filter}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filter} onValueChange={handleFilterChange}>
            {options.map((option, index) => (
                <DropdownMenuRadioItem key={index} value={option} className={"cursor-pointer"}>{option}</DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
