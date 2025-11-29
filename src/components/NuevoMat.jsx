import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"

export function NuevoMat({ onAddMaterial, loading = false }) {
  const [nombre, setNombre] = useState('');
  const [categorias, setCategorias] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [ubicacionEstante, setUbicacionEstante] = useState('');
  const [ubicacionFila, setUbicacionFila] = useState('');
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  const limpiarFormulario = () => {
    setNombre('');
    setCategorias('');
    setCantidad(1);
    setUbicacionEstante('');
    setUbicacionFila('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (cantidad < 1) {
        alert("La cantidad debe ser al menos 1");
        return;
      }
      const materialData = {
        nombre,
        categorias: categorias.split(',').map(c => c.trim()),
        ubicacion: {
          estante: ubicacionEstante,
          fila: ubicacionFila
        },
        imagen: null
      };
      const childrenData = {
        cantidad: parseInt(cantidad),
      };
      const result = await onAddMaterial(materialData,childrenData);
      if (result?.success) {
        limpiarFormulario();
        setOpen(false);
      }
    } catch (error) {
      alert("Error al agregar material: " + (error.message || error));
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={"cursor-pointer"}>Nuevo Material</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Añadiendo nuevo material</DialogTitle>
              <DialogDescription>
                Asegurate de llenar todos los campos para evitar duplicados.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Nombre</Label>
                <Input id="name-1" name="name" defaultValue="" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Categorías separadas por ,</Label>
                <Input id="username-1" name="username" defaultValue="" value={categorias} onChange={(e) => setCategorias(e.target.value)} required />
              </div>
              <div className="flex gap-4">
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="cantidad-1">Cantidad</Label>
                    <Input id="cantidad-1" name="cantidad" type="number" min="1" defaultValue="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                  </div>
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="ubicacion-1">Ubicación</Label>
                    <div className="flex">
                      <Label htmlFor="estante-1" className="mr-2">Estante: </Label>
                      <Input id="estante-1" name="estante" defaultValue="" value={ubicacionEstante} onChange={(e) => setUbicacionEstante(e.target.value)} required />
                      <Label htmlFor="fila-1" className="mr-2">Fila: </Label>
                      <Input id="fila-1" name="fila" defaultValue="" value={ubicacionFila} onChange={(e) => setUbicacionFila(e.target.value)} required />
                    </div>
                  </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" className=" cursor-pointer">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={loading} className=" cursor-pointer">
                {loading ? "Guardando..." : "Guardar material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
