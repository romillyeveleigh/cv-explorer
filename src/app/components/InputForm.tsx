"use client";

import React, {
  useState,
  useRef,
  useEffect,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { X, Loader2, ChevronRightIcon } from "lucide-react";
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

import {
  CV_TEXT,
  OPTION_GROUPS,
  capitalizeFirstLetter,
  isNewOption,
  validateInput,
} from "../utils";
import ButtonGroup from "./ButtonGroup";

const generatePrompt = (cvText: string, selectedOptions: string[]) => {
  return `Generate a project description based on the following CV text and the selected technologies: ${cvText}. Selected technologies: ${selectedOptions.join(", ")}`;
};

type Option = {
  id: string;
  label: string;
};

type OptionGroup = {
  name: string;
  options: Option[];
};

interface InputFormProps {
  isLoading: boolean;
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  updateThread: (prompt: string, isNewThread?: boolean) => Promise<void>;
}

const InputForm: FC<InputFormProps> = ({
  isLoading,
  selectedOptions,
  setSelectedOptions,
  updateThread,
}) => {
  const [inputValue, setInputValue] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<Option[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasGeneratedContent = useRef(false);

  const allOptionGroups: OptionGroup[] = [
    ...OPTION_GROUPS,
    ...(customOptions.length > 0
      ? [{ name: "Custom", options: customOptions }]
      : []),
  ];

  const allOptions = allOptionGroups
    .flatMap((group) => group.options)
    .sort((optionA, optionB) => optionA.label.localeCompare(optionB.label));

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
      const newOption = {
        id: optionLabel,
        label: capitalizeFirstLetter(optionLabel),
      };
      setCustomOptions((prev) => [...prev, newOption]);
      setSelectedOptions((prev) => [...prev, newOption.label]);
    } else {
      setSelectedOptions((prev) => {
        const newOptions = prev.includes(optionLabel)
          ? prev.filter((option) => option !== optionLabel)
          : [...prev, optionLabel];

        return newOptions;
      });
    }
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedOptions([]);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hasGeneratedContent.current = false;

    if (!validateInput(CV_TEXT, selectedOptions)) {
      console.error("Invalid input");
      return;
    }

    const prompt = generatePrompt(CV_TEXT, selectedOptions);

    await updateThread(prompt, true);
    hasGeneratedContent.current = true;
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

  return (
    <Card className="lg:w-1/2 shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Select Technology Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label
              htmlFor="options-input"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <div className="flex flex-row justify-between">
                <span>What skills are you most interested in?</span>
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
                    "Type and select skills, or choose from the categories below"
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
            {/* <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available technologies:
            </Label> */}
            <div className="space-y-4 max-h-[390px] overflow-y-auto">
              {allOptionGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {group.name}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <ButtonGroup
                      group={group}
                      selectedOptions={selectedOptions}
                      handleOptionToggle={handleOptionToggle}
                      toggleGroupExpansion={toggleGroupExpansion}
                      isExpanded={expandedGroups.includes(group.name)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading && hasGeneratedContent.current === false}
          onClick={handleSubmit}
        >
          {isLoading && hasGeneratedContent.current === false ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <span className="group inline-flex items-center">
              Generate Description{" "}
              <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InputForm;
