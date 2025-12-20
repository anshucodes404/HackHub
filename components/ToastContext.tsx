"use client"
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,type 
  ReactNode,
} from "react"
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastData {
  id: number;
  message: string;
}

interface ToastContextType {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string) => {
    const newToast = { id: ++toastId, message };
    setToasts((prev) => [newToast, ...prev]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse items-center space-y-reverse space-y-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [hovered, onClose]);

  return (
    <motion.div
      initial={{ y: -30, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -20, scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white shadow-lg rounded-2xl px-4 py-3 min-w-60 flex items-center justify-between border border-gray-200 transition-transform duration-300 hover:scale-105"
    >
      <span className="text-gray-800 font-medium">{toast.message}</span>
      <button
      type="button"
        onClick={onClose}
        className="ml-3 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};
