import {
  MessageParam,
  Messages,
  MessageCreateParams,
} from "@anthropic-ai/sdk/resources/messages.mjs";

// Force the model to use a specific tool, returning exactly one tool_use block.
// `disable_parallel_tool_use` is a valid API field but is missing from this
// SDK version's types, so we assert the result onto the supported union.
export const forceToolChoice = (name: string) =>
  ({
    type: "tool",
    name,
    disable_parallel_tool_use: true,
  } as MessageCreateParams["tool_choice"]);

export const removeToolResults = (messages: MessageParam[]) => {
  return messages.map((message) => ({
    role: message.role,
    content: Array.isArray(message.content)
      ? message.content.filter((content) => content.type !== "tool_result")
      : message.content,
  }));
};

export const createNewMessage = (
  content: string,
  toolUseBlocks: Messages.ToolUseBlockParam[] = []
): MessageParam => {
  if (toolUseBlocks.length === 0) {
    return { role: "user", content };
  }

  // Every tool_use block in the previous assistant message must be answered
  // with a matching tool_result, or the API rejects the request.
  return {
    role: "user",
    content: [
      ...toolUseBlocks.map((toolUseBlock) => ({
        type: "tool_result" as const,
        tool_use_id: toolUseBlock.id,
        content: JSON.stringify(toolUseBlock.input),
      })),
      {
        type: "text" as const,
        text: content,
      },
    ],
  };
};

function getToolUseBlocks(
  message: MessageParam
): Messages.ToolUseBlockParam[] {
  return Array.isArray(message?.content)
    ? message.content.filter(
        (content): content is Messages.ToolUseBlockParam =>
          content.type === "tool_use"
      )
    : [];
}

export const getToolUseBlocksFromLastMessage = (messages: MessageParam[]) => {
  if (!messages.length) return [];
  const lastMessage = messages[messages.length - 1];
  return getToolUseBlocks(lastMessage);
};
