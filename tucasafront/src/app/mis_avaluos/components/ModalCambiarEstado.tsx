"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/dialog";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/select";
import { useState } from "react";
import { Button } from "@/components/button";

const ModalCambiarEstado = ({ open, setOpen, estadoActual, onSubmit }: any) => {
  const [nuevoEstado, setNuevoEstado] = useState("");

  const transiciones: any = {
    PENDIENTE: ["EN_PROCESO"],
    EN_PROCESO: ["COMPLETADO"],
    COMPLETADO: [],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 mb-2">
          Estado actual: <strong>{estadoActual}</strong>
        </p>

        <Select onValueChange={setNuevoEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nuevo estado" />
          </SelectTrigger>

          <SelectContent>
            {transiciones[estadoActual].map((est: string) => (
              <SelectItem key={est} value={est}>
                {est.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button disabled={!nuevoEstado} onClick={() => onSubmit(nuevoEstado)}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCambiarEstado;
