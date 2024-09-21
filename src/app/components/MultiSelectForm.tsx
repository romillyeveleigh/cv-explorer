"use client";

import React, { useState } from "react";

import InputForm from "./InputForm";
import GeneratedContent from "./GeneratedContent";
import { useMessageThread } from "../hooks";

const TechStackConfigurator = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { responses, updateThread, isLoading } = useMessageThread();

  return (
    <div className="flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow flex flex-col opacity-90">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Enterprise Tech Stack Configurator
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 flex-grow h-[700px]">
          <InputForm
            isLoading={isLoading}
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
            updateThread={updateThread}
          />
          <GeneratedContent
            isLoading={isLoading}
            selectedOptions={selectedOptions}
            responses={responses}
            updateThread={updateThread}
          />
        </div>
      </div>
    </div>
  );
};

export default TechStackConfigurator;
