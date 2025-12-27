"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setApiKey,
  setSettingsOpen,
  setCredits as setCreditsAction,
} from "@/store/settingsSlice";
import {
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppNotification from "./AppNotification";

export default function SettingsModal() {
  const dispatch = useDispatch();
  const { apiKey, isSettingsOpen, tokenUsage } = useSelector(
    (state: RootState) => state.settings
  );
  const [inputKey, setInputKey] = useState(apiKey);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [isCopied, setIsCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Credits state
  const [credits, setCredits] = useState<{
    data: any;
    loading: boolean;
    error: boolean;
  }>({ data: null, loading: false, error: false });

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  const fetchCredits = async (key: string) => {
    if (!key) return;
    setCredits((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch("/api/credits", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCredits({ data: data.data, loading: false, error: false });
      dispatch(setCreditsAction(data.data)); // Dispatch to global store
    } catch (err) {
      setCredits((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  // Auto-fetch on open if key exists
  useEffect(() => {
    if (isSettingsOpen && apiKey) {
      fetchCredits(apiKey);
    }
  }, [isSettingsOpen, apiKey]);

  const handleSave = () => {
    dispatch(setApiKey(inputKey));
    setStatus("saved");
    setShowNotification(true);
    fetchCredits(inputKey);

    setTimeout(() => {
      setStatus("idle");
      setShowNotification(false);
    }, 3000);
  };

  const handleCopy = async () => {
    if (!inputKey) return;
    try {
      await navigator.clipboard.writeText(inputKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    setInputKey("");
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setSettingsOpen(false))}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Notification Overlay inside modal or global? User asked for AppNotification. 
                We can render it here or assume the global one picks it up if we dispatched something. 
                But let's just use local instance for "Saved" feedback as requested. 
            */}
            <AppNotification
              message="API Key saved successfully!"
              type="success"
              isVisible={showNotification}
              onClose={() => setShowNotification(false)}
              autoClose={3000}
            />

            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" />
                Settings
              </h2>
              <button
                onClick={() => dispatch(setSettingsOpen(false))}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* API Key Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OpenRouter API Key
                </label>
                <div className="relative group">
                  <input
                    type={isVisible ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full pl-4 pr-24 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm"
                  />

                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    {/* Clear Button */}
                    {inputKey && (
                      <button
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear Key"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => setIsVisible(!isVisible)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 transition-colors"
                      title={isVisible ? "Hide Key" : "Show Key"}
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-400"
                      title="Copy Key"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Your key is stored locally in your browser.
                </p>
              </div>

              {/* Credit Balance Section */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    Credit Info
                  </label>
                  {credits.loading ? (
                    <span className="text-xs text-gray-400 animate-pulse">
                      Checking...
                    </span>
                  ) : credits.error ? (
                    <span className="text-xs text-red-500">Failed to load</span>
                  ) : credits.data ? (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        Usage: ${Number(credits.data.usage).toFixed(2)}
                      </div>
                      {credits.data.limit !== undefined && (
                        <div className="text-[10px] text-gray-400">
                          Limit:{" "}
                          {credits.data.limit === null
                            ? "Unlimited"
                            : `$${Number(credits.data.limit).toFixed(2)}`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">--</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-2">
              <button
                onClick={handleSave}
                disabled={!inputKey}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                {status === "saved" ? "Saved Successfully" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
