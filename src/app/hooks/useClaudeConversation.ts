import Anthropic from "@anthropic-ai/sdk";
import {
  MessageParam,
} from "@anthropic-ai/sdk/resources/messages.mjs";
import { useState, useCallback } from "react";
import { convertClaudeResponseToMessageParam } from "../utils/convertClaudeResponseToMessageParam";

// export interface Message {
//   role: "user" | "assistant" | "system" | "tool";
//   content: string | Record<string, any>;
// }

interface UseClaudeConversationProps {
  system: Anthropic.MessageCreateParams["system"];
  tools: Anthropic.Tool[];
  customParams?: Partial<Anthropic.MessageCreateParams>;
}

export function useClaudeConversation({
  system,
  tools,
  customParams,
}: UseClaudeConversationProps) {
  const [messages, setMessages] = useState<MessageParam[]>([]);
  console.log("🚀 ~ messages:", messages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      console.log("🚀 ~ content:", content);

      const lastMessage = messages[messages.length - 1];
      const lastMessageToolCall = Array.isArray(lastMessage?.content)
        ? lastMessage.content.find((content) => content.type === "tool_use")
        : undefined;

      const newMessage: MessageParam = {
        role: "user",
        content: lastMessageToolCall?.input
          ? [
              {
                type: "tool_result",
                tool_use_id: lastMessageToolCall.id as string,
                content: JSON.stringify(lastMessageToolCall.input),
              },
              {
                type: "text",
                text: content,
              },
            ]
          : content,
      };

      console.log("🚀 ~ newMessage:", newMessage);

      const newMessages: MessageParam[] = [...messages, newMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/claude-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            system,
            tools,
            customParams,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();
        console.log("🚀 ~ data:", data);
        const assistantMessages: Anthropic.Messages.Message = data.response;

        const assistantMessage = convertClaudeResponseToMessageParam(
          assistantMessages.content
        );

        setMessages([...newMessages, assistantMessage]);
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, system, tools, customParams]
  );

  return { messages, isLoading, sendMessage };
}
