"use client";

import { useState, useCallback } from "react";
import type { ModalType } from "@/components/ConfirmModal";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: ModalType;
  onConfirm: () => void | Promise<void>;
}

interface UseConfirmModalReturn {
  modalState: ConfirmModalState;
  isLoading: boolean;
  openModal: (config: Omit<ConfirmModalState, "isOpen">) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
}

export const useConfirmModal = (): UseConfirmModalReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    type: "warning",
    onConfirm: () => {},
  });

  const openModal = useCallback(
    (config: Omit<ConfirmModalState, "isOpen">): void => {
      setModalState({
        ...config,
        isOpen: true,
      });
    },
    []
  );

  const closeModal = useCallback((): void => {
    if (!isLoading) {
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [isLoading]);

  const handleConfirm = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await modalState.onConfirm();
      closeModal();
    } catch (error) {
      console.error("Error en confirmación:", error);
    } finally {
      setIsLoading(false);
    }
  }, [modalState, closeModal]);

  return {
    modalState,
    isLoading,
    openModal,
    closeModal,
    handleConfirm,
  };
};