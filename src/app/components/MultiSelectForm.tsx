"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Anthropic from "@anthropic-ai/sdk";

import {
  OPTION_GROUPS,
  capitalizeFirstLetter,
  generatePrompt,
  isNewOption,
} from "../utils";
import { generateFollowUpPrompt } from "../utils/promptUtils";
import { ContentBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

const generateAdditionalInfo = (technologies: string[]): string => {
  return `Additional information about the selected technologies:

${technologies
  .map(
    (tech) =>
      `- ${tech}: A key component in modern web development, known for its ${
        Math.random() > 0.5 ? "flexibility" : "performance"
      } and ${Math.random() > 0.5 ? "ease of use" : "robust ecosystem"}.`
  )
  .join("\n")}

This combination of technologies provides a solid foundation for building scalable and maintainable applications.`;
};

export default function Component() {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [aiText, setAiText] = useState("");
  const [additionalInfoSections, setAdditionalInfoSections] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [customOptions, setCustomOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [conversationMessages, setConversationMessages] = useState<
    {
      role: "user" | "assistant";
      content: string | ContentBlock[];
    }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastAddedSectionRef = useRef<HTMLDivElement>(null);

  const allOptions = [
    ...OPTION_GROUPS.flatMap((group) => group.options),
    ...customOptions,
  ];

  const allGroups = [
    ...OPTION_GROUPS,
    ...(customOptions.length > 0
      ? [{ name: "Custom", options: customOptions }]
      : []),
  ];

  const filteredOptions = allOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) && // includes the input value string
      !selectedOptions.includes(option.label) // is not already selected
  );

  const handleOnFocus = (e: React.FocusEvent) => {
    e.preventDefault();
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleOptionToggle = (optionLabel: string) => {
    if (isNewOption(optionLabel, allOptions)) {
      setCustomOptions((prev) => [
        ...prev,
        { id: optionLabel, label: capitalizeFirstLetter(optionLabel) },
      ]);
    }

    setSelectedOptions((prev) => {
      const newOptions = prev.includes(optionLabel)
        ? prev.filter((option) => option !== optionLabel)
        : [...prev, optionLabel];
      setInputValue("");
      return newOptions;
    });

    setIsDropdownOpen(false);
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedOptions([]);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAiText("");
    setAdditionalInfoSections([]);

    const client = new Anthropic({
      apiKey: process.env["NEXT_PUBLIC_API_KEY"],
      dangerouslyAllowBrowser: true,
    });
    console.log(selectedOptions);

    const prompt = generatePrompt(
      process.env["NEXT_PUBLIC_CV_TEXT"],
      selectedOptions
    );

    try {
      const response = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.5,
        messages: [{ role: "user", content: prompt }],
      });

      const newAiText =
        response.content[0].type === "text" ? response.content[0].text : "";

      setAiText(newAiText);
      setConversationMessages([
        { role: "user", content: prompt },
        { role: "assistant", content: response.content },
      ]);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreClick = async () => {
    console.log("handleMoreClick");
    setIsGeneratingMore(true);

    const anthropic = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const followUpPrompt = generateFollowUpPrompt(selectedOptions);
      console.log("🚀 ~ handleMoreClick ~ followUpPrompt:", followUpPrompt);

      const updatedHistory = [
        ...conversationMessages,
        { role: "user", content: followUpPrompt },
      ];

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.5,
        messages: updatedHistory,
      });

      const newAiText =
        response.content[0].type === "text" ? response.content[0].text : "";

      setAdditionalInfoSections((prev) => [...prev, newAiText]);
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: newAiText },
      ]);
    } catch (error) {
      console.error("Error generating more content:", error);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (lastAddedSectionRef.current) {
      lastAddedSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [additionalInfoSections]);

  const isSelectedOption = (option: string) => {
    return selectedOptions.includes(option);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow flex flex-col opacity-90">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Enterprise Tech Stack Configurator
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 flex-grow h-[700px]">
          <Card className="lg:w-1/2 shadow-lg">
            <CardHeader>
              <CardTitle>Select Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label
                    htmlFor="options-input"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex flex-row justify-between">
                      <span>What technologies are you most interested in?</span>
                      {/* TODO: animate the text change */}
                      <span className="text-xs text-gray-500 font-bold">
                        {selectedOptions.length} selected
                      </span>
                    </div>
                  </Label>
                  <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                      <Input
                        id="options-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleOnFocus}
                        placeholder={
                          "Type and select technologies, or choose from below"
                        }
                        className="pr-10"
                        aria-expanded={isDropdownOpen}
                        aria-autocomplete="list"
                        aria-controls="options-list"
                        autoComplete="off"
                      />
                      {inputValue && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={handleClearInput}
                          aria-label="Clear input"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {isDropdownOpen && (
                      <ul
                        id="options-list"
                        className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
                        role="listbox"
                      >
                        {isNewOption(inputValue, allOptions) && (
                          <li
                            key={inputValue}
                            onClick={() => handleOptionToggle(inputValue)}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            role="option"
                            aria-selected={selectedOptions.includes(inputValue)}
                          >
                            {capitalizeFirstLetter(inputValue)}
                          </li>
                        )}
                        {filteredOptions.length > 0 &&
                          filteredOptions.map((option) => (
                            <li
                              key={option.id}
                              onClick={() => handleOptionToggle(option.label)}
                              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                              role="option"
                              aria-selected={selectedOptions.includes(
                                option.label
                              )}
                            >
                              {option.label}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available technologies:
                  </Label>
                  <div className="space-y-4 max-h-[475px] overflow-y-auto">
                    {allGroups.map((group) => (
                      <div key={group.name} className="space-y-2">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {group.name}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {group.options
                            .slice(
                              0,
                              expandedGroups.includes(group.name)
                                ? undefined
                                : 3
                            )
                            .map((option) => (
                              <Button
                                key={option.id}
                                type="button"
                                variant={
                                  isSelectedOption(option.label)
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleOptionToggle(option.label)}
                                className={`text-xs border ${
                                  isSelectedOption(option.label)
                                    ? "border-primary"
                                    : "border-input"
                                }`}
                                aria-pressed={isSelectedOption(option.label)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          {group.options.length > 3 && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => toggleGroupExpansion(group.name)}
                              className="text-xs"
                              aria-expanded={expandedGroups.includes(
                                group.name
                              )}
                            >
                              {expandedGroups.includes(group.name)
                                ? "less"
                                : "more"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Description"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="lg:w-1/2 shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle>AI-Generated Project Description</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-6 space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                    </div>
                  ) : aiText ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {aiText.split("\n")[0].replace(/\*\*/g, "")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {aiText
                            .split("\n")
                            .slice(1)
                            .map((line, index) => (
                              <React.Fragment key={index}>
                                {line.split(" ").map((word, index) =>
                                  // match when the word starts and ends with **
                                  word.match(/^\*\*|\*\*$/) ? (
                                    <span className="font-semibold" key={index}>
                                      {word.replace(/\*\*/g, "")}{" "}
                                    </span>
                                  ) : (
                                    `${word.replace(/\*\*/g, "")} `
                                  )
                                )}
                                <br />
                              </React.Fragment>
                            ))}
                        </p>
                      </div>
                      {additionalInfoSections.map((info, index) => (
                        <div
                          key={index}
                          className="border-t border-gray-200 dark:border-gray-700 pt-4"
                          ref={
                            index === additionalInfoSections.length - 1
                              ? lastAddedSectionRef
                              : null
                          }
                        >
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Additional Information {index + 1}:
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {info
                              .split("\n")
                              .slice(1)
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line.split(" ").map((word, index) =>
                                    // match when the word starts and ends with **
                                    word.match(/^\*\*|\*\*$/) ? (
                                      <span
                                        className="font-semibold"
                                        key={index}
                                      >
                                        {word.replace(/\*\*/g, "")}{" "}
                                      </span>
                                    ) : (
                                      `${word.replace(/\*\*/g, "")} `
                                    )
                                  )}
                                  <br />
                                </React.Fragment>
                              ))}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Click "Generate Description" to create a project
                      description based on your selected technologies.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
              {aiText && (
                <Button
                  onClick={handleMoreClick}
                  variant="outline"
                  className="w-full"
                  disabled={isGeneratingMore}
                >
                  {isGeneratingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating More...
                    </>
                  ) : (
                    "Read more"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
