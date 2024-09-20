"use client";

import React, { useState } from "react";

import { ContentBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
import InputForm from "./InputForm";
import GeneratedContent from "./GeneratedContent";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string | ContentBlock[];
};

const TechStackConfigurator = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [aiText, setAiText] = useState("");
  const [additionalInfoSections, setAdditionalInfoSections] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);

  return (
    <div className="flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow flex flex-col opacity-90">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Enterprise Tech Stack Configurator
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 flex-grow h-[700px]">
          <InputForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSelectedOptions={setSelectedOptions}
            setAiText={setAiText}
            selectedOptions={selectedOptions}
            setConversationMessages={setConversationMessages}
            additionalInfoSections={additionalInfoSections}
            setAdditionalInfoSections={setAdditionalInfoSections}
          />
          <GeneratedContent
            isLoading={isLoading}
            selectedOptions={selectedOptions}
            aiText={aiText}
            conversationMessages={conversationMessages}
            additionalInfoSections={additionalInfoSections}
            setAdditionalInfoSections={setAdditionalInfoSections}
          />
        </div>
      </div>
    </div>
  );
};

export default TechStackConfigurator;
