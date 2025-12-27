"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useEffect } from "react";

export type NotificationType = "success" | "warning" | "error" | "info";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: number;
}

export default function AppNotification({
  message,
  type = "info",
  isVisible,
  onClose,
  autoClose,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  const config = {
    success: { icon: CheckCircle2, color: "bg-green-500", text: "text-white" },
    warning: {
      icon: AlertTriangle,
      color: "bg-yellow-500",
      text: "text-white",
    },
    error: { icon: AlertTriangle, color: "bg-red-500", text: "text-white" },
    info: { icon: Info, color: "bg-blue-500", text: "text-white" },
  };

  const { icon: Icon, color, text } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${color} ${text} max-w-md w-full`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
