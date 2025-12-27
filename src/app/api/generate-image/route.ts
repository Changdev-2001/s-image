import { NextRequest, NextResponse } from "next/server";

// Helper function to detect and extract MIME type from base64 data URL
function extractImageData(imageData: string): {
  mimeType: string;
  base64Data: string;
} {
  // If it's a data URL, extract the MIME type and base64 data
  if (imageData.startsWith("data:")) {
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        base64Data: matches[2],
      };
    }
  }

  // If no data URL prefix, assume it's raw base64 and detect format from header
  const base64Data = imageData.trim();
  let mimeType = "image/png"; // default for most image generation models

  // Detect image type from base64 header
  if (base64Data.startsWith("/9j/")) {
    mimeType = "image/jpeg";
  } else if (base64Data.startsWith("iVBORw0KGgo")) {
    mimeType = "image/png";
  } else if (
    base64Data.startsWith("R0lGODlh") ||
    base64Data.startsWith("R0lGODdh")
  ) {
    mimeType = "image/gif";
  } else if (base64Data.startsWith("UklGR")) {
    mimeType = "image/webp";
  }

  return { mimeType, base64Data };
}

// Helper to validate base64 string
function isValidBase64(str: string): boolean {
  try {
    // Remove whitespace and check if it's valid base64
    const cleaned = str.replace(/\s/g, "");
    return /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) && cleaned.length % 4 === 0;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, imageData, apiKey, model } = body;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API Key is missing.",
          details: "Please provide your OpenRouter API Key in the settings.",
        },
        { status: 401 }
      );
    }

    const selectedModel = model || "google/gemini-2.5-flash-image-preview";

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          error: "A prompt is required.",
          details:
            "Please provide a text description of the image you want to generate.",
        },
        { status: 400 }
      );
    }

    console.log("Sending image generation request to OpenRouter");
    console.log("Model:", selectedModel);
    console.log("Prompt:", prompt);

    // Prepare message content for OpenRouter
    let messageContent: string | any[] = prompt;

    // If image data is provided, prepare multimodal content
    if (imageData) {
      const { mimeType, base64Data } = extractImageData(imageData);

      if (!isValidBase64(base64Data)) {
        return NextResponse.json(
          {
            error: "Invalid image data provided.",
            details:
              "The base64 image data appears to be corrupted or invalid.",
          },
          { status: 400 }
        );
      }

      const imageDataUrl = `data:${mimeType};base64,${base64Data}`;

      messageContent = [
        {
          type: "image_url",
          image_url: {
            url: imageDataUrl,
          },
        },
        {
          type: "text",
          text: `Based on the provided image, ${prompt}. Generate a new image that incorporates the reference image and follows these instructions.`,
        },
      ];
    }

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "S-Image",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
          max_tokens: 1000,
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("OpenRouter API error:", errorData);

      const errorMsg = errorData.error?.message || "Unknown error";

      if (errorMsg.includes("credits") || errorMsg.includes("402")) {
        return NextResponse.json(
          {
            error: "Insufficient credits.",
            details:
              "Your OpenRouter account has run out of credits. Please visit https://openrouter.ai/settings/credits to add more credits.",
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        {
          error: errorMsg,
          details: errorData.error?.metadata || errorMsg,
        },
        { status: openRouterResponse.status }
      );
    }

    const result = await openRouterResponse.json();
    console.log("OpenRouter response received");
    console.log("Full API Response:", JSON.stringify(result, null, 2)); // Debug log

    // Extract image data
    let imageUrl: string | null = null;

    // 1. Check for standard OpenRouter/OpenAI 'images' top-level array
    if (result.images && result.images.length > 0) {
      const img = result.images[0];
      imageUrl = typeof img === "string" ? img : img.url || img.b64_json;
    }

    // 2. Handle Multimodal content array (Common in Gemini/Vision models)
    if (!imageUrl && result.choices?.[0]?.message?.content) {
      const content = result.choices[0].message.content;

      if (Array.isArray(content)) {
        const imagePart = content.find(
          (part: any) => part.type === "image_url" || part.image
        );
        if (imagePart) {
          imageUrl = imagePart.image_url?.url || imagePart.image;
        }
      } else if (typeof content === "string") {
        // Fallback for URL inside text
        const urlMatch = content.match(/https?:\/\/[^\s)\]"]+/);
        if (urlMatch) imageUrl = urlMatch[0];
      }
    }

    // 3. Last Resort: Deep Search (Your existing fallback is good, keep it)
    if (!imageUrl) {
      const searchForImage = (obj: any): string | null => {
        if (!obj || typeof obj !== "object") return null;
        if (
          obj.url &&
          typeof obj.url === "string" &&
          (obj.url.startsWith("http") || obj.url.startsWith("data:"))
        )
          return obj.url;
        if (obj.b64_json)
          return obj.b64_json.startsWith("data:")
            ? obj.b64_json
            : `data:image/png;base64,${obj.b64_json}`;
        if (obj.image && typeof obj.image === "string") return obj.image;

        for (const key in obj) {
          const found = searchForImage(obj[key]);
          if (found) return found;
        }
        return null;
      };
      imageUrl = searchForImage(result);
    }

    if (imageUrl) {
      let finalImageUrl = imageUrl;
      if (
        !imageUrl.startsWith("http") &&
        !imageUrl.startsWith("data:") &&
        isValidBase64(imageUrl)
      ) {
        finalImageUrl = `data:image/png;base64,${imageUrl}`;
      }
      return NextResponse.json({ imageUrl: finalImageUrl, success: true });
    } else {
      return NextResponse.json(
        {
          error: "No valid response from the API.",
          details:
            "The model didn't return any image content. Try a different prompt.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
