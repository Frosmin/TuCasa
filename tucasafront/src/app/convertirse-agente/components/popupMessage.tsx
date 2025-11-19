"use client";

import { useEffect } from "react";
import { XCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupMessageProps {
  show: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function PopupMessage({ show, message, type = "success", onClose }: PopupMessageProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white
            ${type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          {type === "success" ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
