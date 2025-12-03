import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'

export const Buscador = ({ query, setQuery }) => {

  return (
    <>
      <Label htmlFor="query" className={"mb-2 text-2xl"}>Introduce el nombre del material:</Label>
      <Input type="text" placeholder="Búsqueda" value={query} className={"bg-white"} onChange={(e) => setQuery(e.target.value)} />
    </>
  )
}
