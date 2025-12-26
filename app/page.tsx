"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useGenerateImage } from "@/hooks/useGenerateImage";
import Navbar from "@/components/Navbar";
import SettingsModal from "@/components/SettingsModal";
import ModelSelector from "@/components/ModelSelector";
import Notification from "@/components/Notification";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Image as ImageIcon,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setSettingsOpen } from "@/store/settingsSlice";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { generateImage, imageUrl, loading, error } = useGenerateImage();
  const dispatch = useDispatch();
  const { apiKey } = useSelector((state: RootState) => state.settings);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: "warning" | "error" | "success" | "info";
  }>({
    visible: false,
    message: "",
    type: "warning",
  });

  const hasApiKey = !!apiKey;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      dispatch(setSettingsOpen(true));
      return;
    }
    setNotification((prev) => ({ ...prev, visible: false })); // Clear previous errors
    await generateImage(prompt);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-gen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manage Notifications
  useEffect(() => {
    if (!hasApiKey) {
      setNotification({
        visible: true,
        message: "API Key required to generate images.",
        type: "warning",
      });
    } else {
      setNotification((prev) => ({ ...prev, visible: false }));
    }
  }, [hasApiKey]);

  useEffect(() => {
    if (error) {
      setNotification({
        visible: true,
        message: error,
        type: "error",
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar />
      <SettingsModal />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT SIDEBAR: Controls & Input */}
        <section className="w-full md:w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-6 flex flex-col z-10">
          <div className="flex-1 space-y-6">
            <header className="space-y-2">
              <div className="flex items-center text-lg gap-2 text-blue-600 dark:text-blue-400 font-bold  tracking-widest uppercase">
                Imagine | Describe | Create
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Turn your wildest imaginations into breathtaking reality with
                our state-of-the-art AI.
              </p>
            </header>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Prompt
                </label>
                <div className="relative group">
                  <textarea
                    ref={textAreaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A neon-lit cyberpunk city in the rain..."
                    className="w-full p-4 pb-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none min-h-[140px] md:min-h-[200px] shadow-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    disabled={loading}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {prompt.length} chars
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3 h-14">
              {" "}
              {/* Added h-14 and items-center */}
              <ModelSelector />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex-1 h-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT CONTENT: Canvas Area */}
        <section className="flex-1 bg-slate-50 dark:bg-gray-950 relative overflow-y-auto">
          <div className="h-full w-full flex items-center justify-center p-4 md:p-8">
            <motion.div
              layout
              className={`relative w-full max-w-4xl ${
                imageUrl
                  ? "aspect-square md:aspect-auto md:h-full"
                  : "h-64 md:h-96"
              } bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col`}
            >
              <div className="flex-1 relative flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 p-4">
                <AnimatePresence mode="wait">
                  {imageUrl ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={imageUrl}
                        alt="Generated Image"
                        fill
                        className="object-contain" // Contain within the viewing area
                        unoptimized
                      />
                    </motion.div>
                  ) : (
                    !loading && (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-4"
                      >
                        <div className="relative group">
                          {/* Outer Glow/Pulse Effect */}
                          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 blur-3xl rounded-full animate-pulse group-hover:bg-blue-500/30 transition-colors" />

                          {/* Icon Container */}
                          <div className="relative w-32 h-32 mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700 transform group-hover:rotate-3 transition-transform duration-300">
                            <ImageIcon
                              className="w-14 h-14 text-blue-500 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            Ready to create?
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">
                            Your AI masterpiece will materialize right here.
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar */}
              {imageUrl && (
                <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center flex-shrink-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    1024x1024 • PNG
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin" />
                  <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin-reverse" />
                </div>
                <h2 className="text-2xl font-black tracking-tight animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  GENERATING...
                </h2>
                <p className="mt-2 text-slate-500 font-medium">
                  This usually takes 10-20 seconds
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Created By Changdev Hirade
          </span>
        </div>
        <div>&copy; 2024 S-Image • v1.0.4</div>
      </footer>
    </div>
  );
}
