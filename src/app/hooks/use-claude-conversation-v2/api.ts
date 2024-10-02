import { MessageParam, MessageCreateParams, Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

export const fetchClaudeResponse = async (
  messages: MessageParam[],
  system: MessageCreateParams["system"],
  tools: Tool[],
  customParams?: Partial<MessageCreateParams>
) => {
  const response = await fetch("/api/claude-conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      system,
      tools,
      customParams,
    }),
  });

  if (!response.ok) throw new Error(`Failed to get response: ${response.statusText}`);

  return response.json();
};