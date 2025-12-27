import React from "react";
import { Wand2 } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import ModeSelector from "./ModeSelector";
import ImageUpload from "./ImageUpload";
import PresetOptions from "./PresetOptions";
import PromptArea from "./PromptArea";

interface SidebarProps {
  mode: "create" | "enhance";
  setMode: (mode: "create" | "enhance") => void;
  prompt: string;
  setPrompt: (value: string) => void;
  uploadedImage: string | null;
  setUploadedImage: (value: string | null) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerate: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function Sidebar({
  mode,
  setMode,
  prompt,
  setPrompt,
  uploadedImage,
  setUploadedImage,
  handleImageUpload,
  handleGenerate,
  loading,
}: SidebarProps) {
  const isEnhance = mode === "enhance";

  // When switching modes, we might want to clear prompt if going to create?
  // For now let's keep state as is to prevent data loss if accidental switch.

  return (
    <section className="w-full md:w-[400px] h-full border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl flex flex-col z-10">
      {/* Header - Fixed */}
      <div className="p-6 pb-0 flex-shrink-0">
        <header className="space-y-2 mb-6">
          <div className="flex items-center text-lg gap-2 text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase">
            Imagine | Describe | Create
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Turn your wildest imaginations into breathtaking reality with our
            state-of-the-art AI.
          </p>
        </header>

        <ModeSelector mode={mode} setMode={setMode} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isEnhance ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ImageUpload
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              onUpload={handleImageUpload}
            />
            <PresetOptions
              onSelect={(p) => setPrompt(p)}
              currentPrompt={prompt}
            />
          </div>
        ) : (
          <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PromptArea
              prompt={prompt}
              setPrompt={setPrompt}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Footer / Actions - Fixed */}
      <div className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3 h-12">
          <ModelSelector />
          <button
            onClick={handleGenerate}
            disabled={
              loading || !prompt.trim() || (isEnhance && !uploadedImage)
            }
            className="flex-1 h-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {isEnhance ? "Enhance Image" : "Generate Image"}
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
