"use client";

import React, { useState } from "react";
import { useClaudeConversation } from "../hooks/use-claude-conversation";
import Anthropic from "@anthropic-ai/sdk";

interface GenericConversationProps {
  placeholder: string;
  title: string;
  system: Anthropic.MessageCreateParams["system"];
  tools: Anthropic.Tool[];
  customParams?: Partial<Anthropic.MessageCreateParams>;
}

export default function GenericConversation({
  placeholder,
  title,
  system,
  tools,
  customParams,
}: GenericConversationProps) {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useClaudeConversation({
    system,
    tools,
    customParams,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const renderContent = (content: string | Record<string, any>) => {
    if (typeof content === "string") {
      return content;
    } else if (Array.isArray(content)) {
      return content.map((item, index) => {
        if (item.type === "text") {
          return item.text;
        } else if (item.type === "tool_use") {
          return (
            <pre className="whitespace-pre-wrap" key={index}>
              {JSON.stringify(item.input, null, 2)}
            </pre>
          );
        }
      });
    } else {
      return (
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {renderContent(message.content)}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r"
          disabled={isLoading}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}
