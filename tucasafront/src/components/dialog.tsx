"use client";

import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type DialogContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog compound components must be used within a <Dialog />");
  return ctx;
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => onOpenChange(false)}
            data-dialog-overlay
          />
          {/* children (DialogContent should stopPropagation) */}
          <div className="relative z-10">{children}</div>
        </div>
      ) : null}
    </DialogContext.Provider>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * DialogContent: centered card that stops overlay clicks
 */
export const DialogContent: React.FC<DialogContentProps> = ({ children, className, onClick }) => {
  const { onOpenChange } = useDialog();

  return (
    <div
      role="document"
      className={cn(
        "w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
      {/* small close affordance for keyboard users */}
      <button
        type="button"
        aria-label="Cerrar dialogo"
        className="sr-only"
        onClick={() => onOpenChange(false)}
      />
    </div>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h2 className={cn("text-lg font-semibold text-gray-900", className)}>{children}</h2>;
};

export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn("mt-6 flex justify-end gap-3", className)}>{children}</div>;
};
