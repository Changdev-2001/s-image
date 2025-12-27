import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  apiKey: string;
  model: string;
  theme: "light" | "dark";
  tokenUsage: {
    used: number;
    total: number;
  };
  credits: {
    usage: number;
    limit: number | null;
    is_free_tier: boolean;
  } | null;
  isSettingsOpen: boolean;
}

const initialState: SettingsState = {
  apiKey: "",
  model: "google/gemini-2.5-flash-image-preview",
  theme: "light",
  tokenUsage: {
    used: 1232, // Initial fallback
    total: 12000,
  },
  credits: null,
  isSettingsOpen: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("s_image_api_key", action.payload);
      }
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("s_image_model", action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("s_image_theme", action.payload);
        if (action.payload === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    setTokenUsage: (
      state,
      action: PayloadAction<{ used: number; total: number }>
    ) => {
      state.tokenUsage = action.payload;
    },
    setCredits: (state, action: PayloadAction<SettingsState["credits"]>) => {
      state.credits = action.payload;
    },
    initializeSettings: (state) => {
      if (typeof window !== "undefined") {
        const storedKey = localStorage.getItem("s_image_api_key");
        if (storedKey) state.apiKey = storedKey;

        const storedModel = localStorage.getItem("s_image_model");
        if (storedModel) state.model = storedModel;

        const storedTheme = localStorage.getItem("s_image_theme") as
          | "light"
          | "dark";
        if (storedTheme) {
          state.theme = storedTheme;
          if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        } else {
          // Check system preference
          if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ) {
            state.theme = "dark";
            document.documentElement.classList.add("dark");
          }
        }
      }
    },
  },
});

export const {
  setApiKey,
  setModel,
  setTheme,
  toggleSettings,
  setSettingsOpen,
  initializeSettings,
  setTokenUsage,
  setCredits,
} = settingsSlice.actions;
export default settingsSlice.reducer;
