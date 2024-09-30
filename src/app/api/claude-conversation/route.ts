import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { Model } from "@/app/hooks/useMessageThread";

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, system, tools, customParams } = await request.json();

    const defaultParams = {
      model: Model.OPUS,
      max_tokens: 1000,
      temperature: 0.8,
      messages,
      system,
      tools,
    };

    // Merge default params with custom model params
    const mergedParams = { ...defaultParams, ...customParams };

    const response = await anthropic.messages.create(mergedParams);
    // console.log("🚀 ~ POST ~ response:", response);

    // // Handle different types of content in the response
    // let processedResponses = [];

    // // const content = response.content[0];

    // for (const content of response.content) {
    //   if ("text" in content) {
    //     processedResponses.push({ type: "text", content: content.text });
    //   } else if ("image" in content) {
    //     processedResponses.push({ type: "image", content: content.image });
    //   } else if (content.type === "tool_call") {
    //     processedResponses.push({
    //       type: "tool_call",
    //       tool_call: content.tool_call,
    //     });
    //   } else if ("input" in content && typeof content.input === "object") {
    //     processedResponses.push({
    //       type: "structured_data",
    //       content: content.input,
    //     });
    //   } else {
    //     processedResponses.push({ type: "unknown", content: content });
    //   }
    // }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
