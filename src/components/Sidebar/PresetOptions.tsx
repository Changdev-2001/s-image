import React from "react";
import { Film, Layers, Zap } from "lucide-react";

interface PresetOptionsProps {
  onSelect: (prompt: string) => void;
  currentPrompt: string;
}

const PRESETS = [
  {
    id: "cinematic",
    label: "Cinematic",
    icon: Film,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "hover:border-purple-500",
    prompt:
      "Enhance this image to look cinematic, with dramatic lighting, high contrast, and a professional color grade. Make it look like a blockbuster movie shot.",
    desc: "Dramatic lighting & contrast",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    icon: Layers,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "hover:border-emerald-500",
    prompt:
      "Transform this image into a minimalist clean style. Simplify details, use a limited color palette, and focus on clean lines and negative space.",
    desc: "Clean lines & simplicity",
  },
  {
    id: "vintage",
    label: "Vintage",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "hover:border-amber-500",
    prompt:
      "Apply a vintage film look to this image. Add grain, faded colors, and a retro aesthetic reminiscent of 1980s analog photography.",
    desc: "Retro film grain & colors",
  },
];

export default function PresetOptions({
  onSelect,
  currentPrompt,
}: PresetOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Select Style
      </label>
      <div className="grid grid-cols-1 gap-2.5">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = currentPrompt === preset.prompt;

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.prompt)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group relative ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg ${preset.bg} ${preset.color} transition-transform group-hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold truncate ${
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {preset.desc}
                </div>
              </div>
              {isActive && (
                <div className="absolute right-3 w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
