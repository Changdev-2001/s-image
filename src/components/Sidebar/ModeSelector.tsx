import React from "react";
import { Wand2, Image as ImageIcon } from "lucide-react";

interface ModeSelectorProps {
  mode: "create" | "enhance";
  setMode: (mode: "create" | "enhance") => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-6 shadow-inner">
      <button
        onClick={() => setMode("create")}
        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          mode === "create"
            ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Wand2 className="w-4 h-4" />
        Create
      </button>
      <button
        onClick={() => setMode("enhance")}
        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          mode === "enhance"
            ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <ImageIcon className="w-4 h-4" />
        Enhance
      </button>
    </div>
  );
}
