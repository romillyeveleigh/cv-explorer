import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, systemMessage, tools, modelParams } = await request.json();

    const defaultParams = {
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [systemMessage, ...messages],
      system: systemMessage,
      tools: tools
    };

    // Merge default params with custom model params
    const mergedParams = { ...defaultParams, ...modelParams };

    const response = await anthropic.messages.create(mergedParams);
    console.log("🚀 ~ POST ~ response:", response)

    // Handle different types of content in the response
    const content = response.content[0];
    let processedResponse;

    if ('text' in content) {
      processedResponse = { type: 'text', content: content.text };
    } else if ('image' in content) {
      processedResponse = { type: 'image', content: content.image };
    } else if (content.type === 'tool_call') {
      processedResponse = {
        type: 'tool_call',
        tool_call: content.tool_call
      };
    } else if ('input' in content && typeof content.input === 'object') {
      processedResponse = { type: 'structured_data', content: content.input };
    } else {
      processedResponse = { type: 'unknown', content: content };
    }

    return NextResponse.json({ response: processedResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}