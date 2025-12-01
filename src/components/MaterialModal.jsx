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

export function MaterialModal({ onAddMaterial, loading = false, editMode = false, existingData = null, button=null }) {
  const [nombre, setNombre] = useState(existingData ? existingData.nombre : '');
  const [categorias, setCategorias] = useState(existingData ? existingData.categorias.join(', ') : '');
  const [cantidad, setCantidad] = useState(existingData ? existingData.totales : 1);
  const [ubicacionEstante, setUbicacionEstante] = useState(existingData ? existingData.ubicacion?.estante || '' : '');
  const [ubicacionFila, setUbicacionFila] = useState(existingData ? existingData.ubicacion?.fila || '' : '');
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const [laboratorio, setLaboratorio] = useState(existingData ? existingData.laboratorio || '' : '');
  const [imagen, setImagen] = useState(existingData ? null : null);
  const [imagenNombre, setImagenNombre] = useState(existingData ? existingData.imageName || '' : '');
  
  const limpiarFormulario = () => {
    setNombre('');
    setCategorias('');
    setCantidad(1);
    setUbicacionEstante('');
    setUbicacionFila('');
    setImagen(null);
    setImagenNombre('');
    setLaboratorio('');
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenNombre(file.name);
    }
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
        laboratorio,
        imageName: imagenNombre
      };
      const childrenData = {
        cantidad: parseInt(cantidad),
      };
      const result = await onAddMaterial(materialData,childrenData,imagen);
      if (result?.success) {
        limpiarFormulario();
        setOpen(false);
      }
    } catch (error) {
      alert("Error al agregar material: " + (error.message || error));
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    try{
      const materialData = {
        nombre:nombre,
        categorias: categorias.split(',').map(c => c.trim()),
        ubicacion: {
          estante: ubicacionEstante,
          fila: ubicacionFila
        },
        laboratorio: laboratorio,
      };
      let payload = {materialData: materialData, id: existingData.id};
      if (cantidad > existingData.totales) {
        if (window.confirm(`¿Estás seguro de querer añadir ${cantidad - existingData.totales}  instancias más?`)) {
          payload = { ...payload, cantidad: {extras:cantidad - existingData.totales,antes: existingData.totales} };
        } else {
          return;
        }
      } else if (cantidad < existingData.totales) {
        alert("No se puede reducir la cantidad de un material existente.");
        return;
      }
      let result;
      if(imagenNombre !== existingData.imageName){
        materialData.imageName = imagenNombre;
        payload = {...payload, imagen: imagen};
      }

      result = await onAddMaterial(payload);
      
      if (result?.success) {
        limpiarFormulario();
        setOpen(false);
      }
    } catch (error) {
      alert("Error al editar material: " + (error.message || error));
    }
  }


  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {button || <Button variant="outline" className={"cursor-pointer"}>Nuevo Material</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={editMode ? handleEdit : handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editMode ? "Editando material" : "Añadiendo nuevo material"}</DialogTitle>
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
              <div className="flex gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Laboratorio</Label>
                  <Input id="username-1" name="username" defaultValue="" className={"w-60"} value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} required />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="picture">Imagen</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="picture" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="picture" 
                      className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-sm transition-colors"
                    >
                      Examinar
                    </Label>
                    <span className="text-sm text-gray-500 truncate max-w-[100px] ">
                      {imagenNombre || 'Sin foto'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="cantidad-1">Cantidad</Label>
                    <Input id="cantidad-1" name="cantidad" type="number" min="1" defaultValue="1" className="max-w-[150px]" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                  </div>
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="ubicacion-1">Ubicación</Label>
                    <div className="flex">
                      <Label htmlFor="estante-1" className="mr-2">Estante: </Label>
                      <Input id="estante-1" name="estante" defaultValue="" className="max-w-10" value={ubicacionEstante} onChange={(e) => setUbicacionEstante(e.target.value)} required />
                      <Label htmlFor="fila-1" className="mr-2">Fila: </Label>
                      <Input id="fila-1" name="fila" defaultValue="" className="max-w-10" value={ubicacionFila} onChange={(e) => setUbicacionFila(e.target.value)} required />
                    </div>
                  </div>
              </div>
            </div>
            <DialogFooter className={"mt-4"}>
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
