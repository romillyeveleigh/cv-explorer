"use client";

import React, { useMemo, useState } from "react";

import Anthropic from "@anthropic-ai/sdk";

const getClient = () => {
  return new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    dangerouslyAllowBrowser: true,
  });
};

export const useMessageThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Anthropic.Messages.MessageParam[]>(
    []
  );

  const createRequestMessage: (
    prompt: string
  ) => Anthropic.Messages.MessageParam = (prompt) => ({
    role: "user",
    content: prompt,
  });

  const generateResponse = async (
    messages: Anthropic.Messages.MessageParam[]
  ) => {
    return await getClient().messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 1,
      messages,
    });
  };

  const updateThread = async (prompt: string, isNewThread: boolean = false) => {
    setIsLoading(true);
    try {
      const request = createRequestMessage(prompt);
      const currentMessages = isNewThread ? [] : messages;
      const response = await generateResponse([...currentMessages, request]);

      const responseMessage: Anthropic.Messages.MessageParam = {
        role: "assistant",
        content: response.content,
      };

      setMessages((prevMessages) =>
        isNewThread
          ? [request, responseMessage]
          : [...prevMessages, request, responseMessage]
      );
    } catch (error) {
      console.error("Error updating thread:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const responses = useMemo(() => {
    return messages
      .filter((message) => message.role === "assistant")
      .map((message) =>
        typeof message.content[0] === "string"
          ? message.content[0]
          : "text" in message.content[0]
          ? message.content[0].text
          : ""
      );
  }, [messages]);

  return {
    isLoading,
    responses,
    updateThread,
  };
};
