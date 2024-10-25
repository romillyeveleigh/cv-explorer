import {
  MessageParam,
  MessageCreateParams,
  Tool,
} from "@anthropic-ai/sdk/resources/messages.mjs";

export const fetchClaudeResponse = async (
  messages: MessageParam[],
  customParams?: Partial<MessageCreateParams>
) => {
  const response = await fetch("/api/claude-conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      customParams,
    }),
  });

  if (!response.ok)
    throw new Error(`Failed to get response: ${response.statusText}`);

  return response.json();
};
