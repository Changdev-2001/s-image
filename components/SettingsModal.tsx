"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setApiKey, setSettingsOpen } from "@/store/settingsSlice";
import {
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsModal() {
  const dispatch = useDispatch();
  const { apiKey, isSettingsOpen, tokenUsage } = useSelector(
    (state: RootState) => state.settings
  );
  const [inputKey, setInputKey] = useState(apiKey);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [isCopied, setIsCopied] = useState(false);
  const [credits, setCredits] = useState<{
    balance: number;
    loading: boolean;
    error: boolean;
  }>({ balance: 0, loading: false, error: false });

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  // Fetch credits when modal opens and API key exists
  useEffect(() => {
    const fetchCredits = async () => {
      if (!isSettingsOpen || !apiKey) return;

      setCredits((prev) => ({ ...prev, loading: true, error: false }));

      try {
        const response = await fetch("/api/credits", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch credits");

        const data = await response.json();
        // OpenRouter returns { balance: number } in dollars
        setCredits({
          balance: data.balance || 0,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchCredits();
  }, [isSettingsOpen, apiKey]);

  const handleSave = () => {
    dispatch(setApiKey(inputKey));
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
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

  const calculatePercentage = () => {
    if (tokenUsage.total === 0) return 0;
    return Math.min(100, (tokenUsage.used / tokenUsage.total) * 100);
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
                <div className="relative">
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full pl-4 pr-20 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      type="button"
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-500 dark:text-gray-400"
                      title="Copy API Key"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {status === "saved" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
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
                    Credit Balance
                  </label>
                  {credits.loading ? (
                    <span className="text-xs text-gray-400">Loading...</span>
                  ) : credits.error ? (
                    <span className="text-xs text-red-500">Error</span>
                  ) : (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${credits.balance.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-2">
              <button
                onClick={handleSave}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
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
