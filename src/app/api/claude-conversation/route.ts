import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

import { Model } from "@/app/utils/types";

const DEFAULT_PARAMS = {
  model: Model.OPUS,
  max_tokens: 1000,
  temperature: 0.8,
};

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, customParams } = await request.json();

    // Merge default params with custom model params
    const mergedParams = { ...DEFAULT_PARAMS, messages, ...customParams };

    const response = await anthropic.messages.create(mergedParams);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
