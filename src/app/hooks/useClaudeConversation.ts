import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { useState, useCallback, useMemo } from "react";
import { convertClaudeResponseToMessageParam } from "../utils/convertClaudeResponseToMessageParam";

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

  const filteredMessages = useMemo(() => {
    return messages.map((message) => {
      return {
        role: message.role,
        content: Array.isArray(message.content)
          ? message.content.filter((content) => content.type !== "tool_result")
          : message.content,
      };
    });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
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
        const assistantMessages: Anthropic.Messages.Message = data.response;

        // const assistantMessage = convertClaudeResponseToMessageParam(
        //   assistantMessages.content
        // );

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: assistantMessages.content,
          },
        ]);
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

  return { messages: filteredMessages, isLoading, sendMessage };
}
