import { BackgroundPages } from '@/components/BackgroundPages'
import Navbar from '@/components/Navbar'
import { Buscador } from '@/components/Buscador'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase/Firebase'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { Pencil } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // <-- cambiado de "query"
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editFaltas, setEditFaltas] = useState(0);
  const [editEstado, setEditEstado] = useState('activo');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "user")); // ya no choca con el estado

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(users);
      setFilteredUsuarios(users);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener usuarios: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.trim().toLowerCase();
      const filtered = usuarios.filter(user => {
        const username = user.email?.split('@')[0].toLowerCase() || '';
        return username.includes(lowerQuery);
      });
      setFilteredUsuarios(filtered);
    } else {
      setFilteredUsuarios(usuarios);
    }
  }, [searchQuery, usuarios]); // dependencias actualizadas

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFaltas(user.faltas || 0);
    setEditEstado(user.estado || 'activo');
    setOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!editingUser) return;

    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        faltas: Number(editFaltas),
        estado: editEstado
      });

      setOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
      alert("Error al actualizar usuario: " + error.message);
    }
  };

  const UserCard = ({ user }) => {
    const username = user.email?.split('@')[0] || 'Usuario';
    const isDeudor = (user.faltas || 0) > 0;
    const estadoColor = user.estado === 'activo' ? 'text-green-600' : 'text-red-600';

    return (
      <div className='border border-gray-300 rounded-lg p-4 shadow-md mb-3 bg-white'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-gray-800'>{username}</h3>
            <div className='mt-2 flex gap-6'>
              <div>
                <span className='text-sm text-gray-600'>Estado: </span>
                <span className={`font-semibold ${estadoColor}`}>
                  {user.estado || 'activo'}
                </span>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Faltas: </span>
                <span className={`font-semibold ${isDeudor ? 'text-red-600' : 'text-gray-800'}`}>
                  {user.faltas || 0}
                </span>
                {isDeudor && (
                  <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded'>
                    Deudor
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={() => handleEditUser(user)}
            className='p-2 hover:bg-blue-100 rounded transition-colors cursor-pointer'
            variant="ghost"
            title='Editar'
          >
            <Pencil size={18} className='text-blue-600' />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen">
        <BackgroundPages />
        <Navbar />

        <section className="px-10 py-6 overflow-y-hidden mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestionar Usuarios</h1>

          {/* actualiza props al Buscador */}
          <Buscador query={searchQuery} setQuery={setSearchQuery} />

          <div className="mt-6 overflow-y-auto h-[75vh]">
            {loading ? (
              <p className="text-center py-4">Cargando usuarios...</p>
            ) : filteredUsuarios.length === 0 ? (
              <p className="text-gray-500">No hay usuarios para mostrar.</p>
            ) : (
              filteredUsuarios.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal de edición */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica las faltas o el estado del usuario.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="username">Usuario</Label>
                <Input 
                  id="username" 
                  value={editingUser.email?.split('@')[0] || ''} 
                  disabled 
                  className="bg-gray-100"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="faltas">Faltas</Label>
                <Input 
                  id="faltas" 
                  type="number" 
                  min="0"
                  value={editFaltas}
                  onChange={(e) => setEditFaltas(Number(e.target.value))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="estado">Estado</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full text-black cursor-pointer">
                      {editEstado}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Estado</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={editEstado} onValueChange={setEditEstado}>
                      <DropdownMenuRadioItem value="activo" className="cursor-pointer">
                        activo
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="inactivo" className="cursor-pointer">
                        inactivo
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" className="cursor-pointer">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveChanges} className="cursor-pointer">
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
