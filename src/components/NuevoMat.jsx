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

export function NuevoMat() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Nuevo Material</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadiendo nuevo material</DialogTitle>
            <DialogDescription>
              Asegurate de llenar todos los campos para evitar duplicados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Nombre</Label>
              <Input id="name-1" name="name" defaultValue="Equipo" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Categorías separadas por ,</Label>
              <Input id="username-1" name="username" defaultValue="Ropa, talla s," />
            </div>
            <div className="flex gap-4">
                <div className="grid gap-3 w-full">
                  <Label htmlFor="username-1">Cantidad</Label>
                  <Input id="username-1" name="username" defaultValue="10" />
                </div>
                <div className="grid gap-3 w-full">
                  <Label htmlFor="username-1">Ubicación</Label>
                  <div className="flex">
                    <Label htmlFor="username-1" className="mr-2">Estante: </Label>
                    <Input id="username-1" name="username" defaultValue="3" />
                    <Label htmlFor="username-1" className="mr-2">Fila: </Label>
                    <Input id="username-1" name="username" defaultValue="2" />
                  </div>
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar material</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
