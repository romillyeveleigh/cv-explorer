"use client";

import React, { useState, useRef, useEffect, FC } from "react";
import { X, Loader2 } from "lucide-react";
import * as SimpleIcons from "simple-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Anthropic from "@anthropic-ai/sdk";

import {
  OPTION_GROUPS,
  capitalizeFirstLetter,
  generatePrompt,
  isNewOption,
} from "../utils";
import { ContentBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

const renderIcon = (slug: string) => {
  // parsed slug should capitalize the first letter and precede it with si
  const parsedSlug = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = SimpleIcons[parsedSlug as keyof typeof SimpleIcons];

  return icon ? (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-4 w-4 mr-2"
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  ) : null;
};

interface InputFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;
  setAiText: (aiText: string) => void;
  setConversationMessages: (
    conversationMessages: {
      role: "user" | "assistant";
      content: string | ContentBlock[];
    }[]
  ) => void;
  additionalInfoSections: string[];
  setAdditionalInfoSections: (additionalInfoSections: string[]) => void;
}

const InputForm: FC<InputFormProps> = ({
  isLoading,
  setIsLoading,
  selectedOptions,
  setSelectedOptions,
  setAiText,
  setConversationMessages,
  additionalInfoSections,
  setAdditionalInfoSections,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // const [aiText, setAiText] = useState("");
  // const [additionalInfoSections, setAdditionalInfoSections] = useState<
  //   string[]
  // >([]);

  const [customOptions, setCustomOptions] = useState<
    { id: string; label: string }[]
  >([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  

  const isSelectedOption = (option: string) => {
    return selectedOptions.includes(option);
  };

  return (
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
                        aria-selected={selectedOptions.includes(option.label)}
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
                        expandedGroups.includes(group.name) ? undefined : 3
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
                          } flex items-center `}
                          aria-pressed={isSelectedOption(option.label)}
                        >
                          {renderIcon(option.id)}
                          {option.label}
                        </Button>
                      ))}

                    {group.options.length > 3 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => toggleGroupExpansion(group.name)}
                        className="text-xs"
                        aria-expanded={expandedGroups.includes(group.name)}
                      >
                        {expandedGroups.includes(group.name) ? "less" : "more"}
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
  );
};

export default InputForm;
