"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/dialog";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/select";
import { useState } from "react";
import { Button } from "@/components/button";

interface ModalCambiarEstadoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  estadoActual: string;
  onSubmit: (nuevoEstado: string) => void;
}

const estadoStyles: Record<string, string> = {
  CANCELADO: "bg-red-100 text-red-800 px-2 py-1 rounded",
  EN_PROGRESO: "bg-blue-100 text-blue-800 px-2 py-1 rounded",
  POR_ASIGNAR: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded",
  COMPLETADO: "bg-green-100 text-green-800 px-2 py-1 rounded",
};

const transiciones: Record<string, string[]> = {
  EN_PROCESO: ["COMPLETADO", "CANCELADO"],
  POR_ASIGNAR: ["EN_PROGRESO", "COMPLETADO", "CANCELADO"],
  COMPLETADO: [],
  CANCELADO: [],
};

const ModalCambiarEstado = ({ open, setOpen, estadoActual, onSubmit }: ModalCambiarEstadoProps) => {
  const [nuevoEstado, setNuevoEstado] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 mb-2">
          Estado actual: <span className={estadoStyles[estadoActual]}>{estadoActual.replace("_", " ")}</span>
        </p>

        <Select onValueChange={setNuevoEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nuevo estado" />
          </SelectTrigger>

          <SelectContent>
            {transiciones[estadoActual]?.map((est) => (
              <SelectItem key={est} value={est}>
                <span className={estadoStyles[est]}>{est.replace("_", " ")}</span>
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
