"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setModel } from "@/store/settingsSlice";
import { Box, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_MODELS } from "@/constants/models";

export default function ModelSelector() {
  const dispatch = useDispatch();
  const selectedModel = useSelector((state: RootState) => state.settings.model);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (modelId: string) => {
    dispatch(setModel(modelId));
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0 w-14 h-14">
      {/* Trigger Button - Fixed square matching the height of the Generate button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 ${
          isOpen ? "ring-2 ring-blue-500/20 border-blue-500" : ""
        }`}
        title="Select AI Model"
        type="button"
      >
        <Box
          className={`w-6 h-6 transition-colors ${
            isOpen ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
        />
      </button>

      {/* Backdrop for clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-700 overflow-hidden z-40 p-1"
          >
            <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Select Model
              </div>
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors
                    ${
                      selectedModel === model.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <span className="flex-1 truncate">{model.name}</span>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
