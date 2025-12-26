import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface GenerateImageResponse {
  imageUrl: string | null;
  error: string | null;
  debugInfo: any;
}

interface UseGenerateImageReturn {
  generateImage: (prompt: string) => Promise<void>;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  debugInfo: any;
  reset: () => void;
}

export const useGenerateImage = (): UseGenerateImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const { apiKey, model } = useSelector((state: RootState) => state.settings);

  const generateImage = useCallback(
    async (prompt: string) => {
      // Validate prompt
      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        setError("Please enter a prompt to generate an image.");
        setLoading(false);
        return;
      }

      if (!apiKey) {
        setError("API Key is missing. Please configure it in settings.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setImageUrl(null);
      setDebugInfo(null);

      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            apiKey,
            model,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Combine error and details for a more informative error message
          const errorMessage = data.details
            ? `${data.error}\n\n${data.details}`
            : data.error || "Failed to generate image";
          throw new Error(errorMessage);
        }

        // Handle the response format from Google GenAI or others
        if (data.success && data.imageUrl) {
          setImageUrl(data.imageUrl);
          setDebugInfo(null);
        } else if (data.textResponse && !data.imageUrl) {
          // API returned text but no image
          throw new Error(
            data.warning ||
              "API returned text but no image. The model may not support this type of image generation."
          );
        } else {
          throw new Error(
            data.error || "No valid image data received from the server."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    [apiKey, model]
  );

  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
    setDebugInfo(null);
    setLoading(false);
  }, []);

  return {
    generateImage,
    imageUrl,
    loading,
    error,
    debugInfo,
    reset,
  };
};
