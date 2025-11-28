"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

type SelectContextType = {
  value: string;
  placeholder?: string;
  open: boolean;
  setOpen: (s: boolean) => void;
  onChange?: (value: string) => void;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export const useSelect = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be used within a <Select />");
  return ctx;
};

interface SelectProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Select: raíz que controla estado abierto y valor
 */
export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue,
  placeholder,
  onValueChange,
  children,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(controlledValue ?? defaultValue ?? "");

  // sync controlled
  useEffect(() => {
    if (controlledValue !== undefined) setInternalValue(controlledValue);
  }, [controlledValue]);

  const handleChange = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: internalValue,
        placeholder,
        open,
        setOpen,
        onChange: handleChange,
      }}
    >
      <div className={cn("relative w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * SelectTrigger: botón que muestra el valor y abre/cierra el select
 */
export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children }) => {
  const { value, placeholder, open, setOpen } = useSelect();

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full flex items-center justify-between px-4 py-2 text-sm border rounded-md bg-white",
        "hover:bg-gray-50",
        className
      )}
    >
      {children ?? <span className="truncate">{value || placeholder || "Seleccionar..."}</span>}
      <ChevronsUpDown size={16} />
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

/**
 * SelectValue: muestra el valor actual (puede usarse dentro del Trigger)
 */
export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
  const { value } = useSelect();
  return <span className={cn("truncate", className)}>{value || placeholder}</span>;
};

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * SelectContent: contenedor de items que se posiciona abajo del trigger
 */
export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { open } = useSelect();
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        // no-op here: actual close is done by item selection or outer logic
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg overflow-hidden",
        className
      )}
      role="listbox"
    >
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SelectItem: cada opción. Llama onChange del contexto al click
 */
export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  const { onChange } = useSelect();

  return (
    <div
      role="option"
      tabIndex={0}
      onClick={() => onChange?.(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange?.(value);
        }
      }}
      className={cn("px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm", className)}
    >
      {children}
    </div>
  );
};
