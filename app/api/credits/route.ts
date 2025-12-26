import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("Authorization");

  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 401 });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/credits", {
      headers: {
        Authorization: apiKey,
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "S-Image",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch credits");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
