import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.split(" ")[1];

    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Failed to fetch key info", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // OpenRouter returns:
    // {
    //   "data": {
    //     "label": "Key Label",
    //     "usage": number, // usage this month?
    //     "limit": number | null, // credit limit?
    //     "is_free_tier": boolean
    //   }
    // }
    // OR for credits: https://openrouter.ai/api/v1/credits might be different?
    // The doc says `GET /api/v1/auth/key` returns key info.
    // Let's also try checking `GET /api/v1/credits` if it exists, specifically for balance.
    // Documentation says: https://openrouter.ai/docs#get-key-info provides `limit` and `usage`.
    // Actually, users want "Credits".
    // OpenRouter `https://openrouter.ai/api/v1/auth/key` return structure:
    // { data: { label: string, limit: number | null, usage: number } }

    // NOTE: 'limit' is usually the monthly limit user set. 'usage' is usage.
    // It doesn't strictly give "Balance" for prepaid credits directly in all docs,
    // but usually (Limit - Usage) or just verifying if they have access is key.
    // However, for prepaid, `limit` might be null.
    // Let's pass the whole data object back to frontend to interpret.

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in /api/credits:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
