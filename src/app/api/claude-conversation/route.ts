import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

import { Model } from "@/types";

const DEFAULT_PARAMS = {
  model: Model.OPUS,
  max_tokens: 1000,
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
