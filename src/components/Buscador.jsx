import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
export const Buscador = () => {
  const [query, setQuery] = useState("")
  return (
    <>
      <Label htmlFor="query">Introduce el nombre del material:</Label>
      <Input type="text" placeholder="Búsqueda" value={query} onChange={(e) => setQuery(e.target.value)} />
    </>
  )
}
