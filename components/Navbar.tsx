"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setTheme, setSettingsOpen } from "@/store/settingsSlice";
import { Moon, Sun, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const { theme, apiKey } = useSelector((state: RootState) => state.settings);

  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            S Image
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.div>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => dispatch(setSettingsOpen(true))}
            className={`
                p-2 rounded-full transition-all relative
                ${
                  !apiKey
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                }
            `}
            aria-label="Open settings"
          >
            <Settings className={`w-5 h-5 ${!apiKey ? "animate-pulse" : ""}`} />
            {!apiKey && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-ping" />
            )}
            {!apiKey && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
