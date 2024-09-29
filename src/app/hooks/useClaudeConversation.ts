import Anthropic from "@anthropic-ai/sdk";
import { useState, useCallback } from "react";

export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string | Record<string, any>;
}

interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

interface UseClaudeConversationProps {
  systemMessage: Anthropic.MessageCreateParams["system"];
  tools: Anthropic.Tool[];
  modelParams?: Record<string, any>;
}

export function useClaudeConversation({
  systemMessage,
  tools,
  modelParams = {},
}: UseClaudeConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      console.log("🚀 ~ content:", content)
      const newMessages = [...messages, { role: "user", content }];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/claude-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            systemMessage,
            tools,
            modelParams,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();
        const assistantMessage = data.response;

        switch (assistantMessage.type) {
          case "text":
            setMessages([
              ...newMessages,
              { role: "assistant", content: assistantMessage.content },
            ]);
            break;
          case "tool_call":
            const toolCall = assistantMessage.tool_call;
            setMessages([
              ...newMessages,
              { role: "tool", content: toolCall.function.arguments },
              {
                role: "assistant",
                content:
                  "Here's the structured information. Would you like me to explain it?",
              },
            ]);
            break;
          case "structured_data":
            setMessages([
              ...newMessages,
              { role: "tool", content: assistantMessage.content },
              {
                role: "assistant",
                content:
                  "Here's the structured information you requested. Would you like me to explain it?",
              },
            ]);
            break;
          case "image":
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content:
                  "An image was generated, but I cannot display it here.",
              },
            ]);
            break;
          default:
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: "I received a response I don't know how to handle.",
              },
            ]);
        }
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
    [messages, systemMessage, tools, modelParams]
  );

  return { messages, isLoading, sendMessage };
}
