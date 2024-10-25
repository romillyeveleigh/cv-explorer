import { useState, useCallback, useMemo } from "react";
import Anthropic from "@anthropic-ai/sdk";
import {
  Message,
  MessageParam,
} from "@anthropic-ai/sdk/resources/messages.mjs";

import {
  removeToolResults,
  createNewMessage,
  getToolUseBlockFromLastMessage,
} from "./utils";
import { fetchClaudeResponse } from "./api";

export function useClaudeConversation() {
  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMessages = useMemo(() => {
    return removeToolResults(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (
      content: string,
      customParams?: Partial<Anthropic.MessageCreateParams>,
      isNewConversation = false
    ) => {
      const toolUseBlock = getToolUseBlockFromLastMessage(messages);
      const newMessage = createNewMessage(
        content,
        isNewConversation ? undefined : toolUseBlock
      );
      const newMessages = [...(isNewConversation ? [] : messages), newMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const data = await fetchClaudeResponse(newMessages, customParams);

        const { content }: Message = data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content },
        ]);
        setIsLoading(false);
        return { role: "assistant", content };
      } catch (error: any) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: `Sorry, there was an error processing your request: ${error.message}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages: filteredMessages, isLoading, sendMessage, resetMessages };
}
