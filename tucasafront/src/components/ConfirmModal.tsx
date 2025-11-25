"use client";

import { useEffect, useRef } from "react";
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export type ModalType = "warning" | "success" | "info" | "danger";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: ModalType;
    isLoading?: boolean;
}

const modalConfig: Record<
    ModalType,
    {
        icon: typeof AlertTriangle;
        iconColor: string;
        confirmButtonClass: string;
    }
> = {
    warning: {
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        confirmButtonClass:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
    success: {
        icon: CheckCircle,
        iconColor: "text-green-600",
        confirmButtonClass: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    info: {
        icon: Info,
        iconColor: "text-blue-600",
        confirmButtonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    danger: {
        icon: XCircle,
        iconColor: "text-red-600",
        confirmButtonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "warning",
    isLoading = false,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const config = modalConfig[type];
    const Icon = config.icon;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === "Escape" && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isLoading, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center ${type === "warning"
                                    ? "bg-yellow-100"
                                    : type === "success"
                                        ? "bg-green-100"
                                        : type === "info"
                                            ? "bg-blue-100"
                                            : "bg-red-100"
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmButtonClass}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};