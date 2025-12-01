import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
export const Buscador = ({ materiales, onSearch }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const filtered = materiales.filter(material => 
      material.nombre.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(filtered);
  }, [query, materiales]);
  return (
    <>
      <Label htmlFor="query" className={"mb-2"}>Introduce el nombre del material:</Label>
      <Input type="text" placeholder="Búsqueda" value={query} onChange={(e) => setQuery(e.target.value)} />
    </>
  )
}
