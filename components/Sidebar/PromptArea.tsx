import React, { useRef, useEffect } from "react";

interface PromptAreaProps {
  prompt: string;
  setPrompt: (value: string) => void;
  loading: boolean;
}

export default function PromptArea({
  prompt,
  setPrompt,
  loading,
}: PromptAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (!loading) {
      textAreaRef.current?.focus();
    }
  }, [loading]);

  return (
    <div className="space-y-2 h-full flex flex-col">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Enter Prompt
      </label>
      <div className="relative group flex-1">
        <textarea
          ref={textAreaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon-lit cyberpunk city in the rain..."
          className="w-full h-full p-4 pb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm text-sm leading-relaxed"
          disabled={loading}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {prompt.length} chars
          </span>
        </div>
      </div>
    </div>
  );
}
