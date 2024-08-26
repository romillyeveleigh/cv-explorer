"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const generateAIText = (technologies: string[]): string => {
  if (technologies.length === 0)
    return "Please select some technologies to generate a description.";

  return `Based on the selected technologies (${technologies.join(
    ", "
  )}), here's a possible project description:

A cutting-edge application leveraging ${technologies[0]} and ${
    technologies[technologies.length - 1]
  } to create a robust and scalable solution. The project utilizes ${technologies
    .slice(1, -1)
    .join(
      ", "
    )} to ensure optimal performance and user experience. This tech stack allows for efficient development and maintenance, making it an ideal choice for modern software projects.`;
};

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastAddedSectionRef = useRef<HTMLDivElement>(null);

  const optionGroups = [
    {
      name: "Key Tech",
      options: [
        { id: "javascript", label: "JavaScript" },
        { id: "typescript", label: "TypeScript" },
        { id: "python", label: "Python" },
        { id: "java", label: "Java" },
        { id: "csharp", label: "C#" },
        { id: "golang", label: "Go" },
      ],
    },
    {
      name: "Front End",
      options: [
        { id: "react", label: "React" },
        { id: "vue", label: "Vue.js" },
        { id: "angular", label: "Angular" },
        { id: "svelte", label: "Svelte" },
        { id: "nextjs", label: "Next.js" },
        { id: "tailwindcss", label: "Tailwind CSS" },
      ],
    },
    {
      name: "Full Stack",
      options: [
        { id: "nodejs", label: "Node.js" },
        { id: "django", label: "Django" },
        { id: "rails", label: "Ruby on Rails" },
        { id: "aspnet", label: "ASP.NET" },
        { id: "laravel", label: "Laravel" },
        { id: "spring", label: "Spring Boot" },
      ],
    },
    {
      name: "Databases",
      options: [
        { id: "postgresql", label: "PostgreSQL" },
        { id: "mysql", label: "MySQL" },
        { id: "mongodb", label: "MongoDB" },
        { id: "redis", label: "Redis" },
        { id: "elasticsearch", label: "Elasticsearch" },
        { id: "cassandra", label: "Cassandra" },
      ],
    },
  ];

  const allOptions = optionGroups.flatMap((group) => group.options);

  const filteredOptions = allOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedOptions.includes(option.label)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleOptionToggle = (optionLabel: string) => {
    setSelectedOptions((prev) => {
      const newOptions = prev.includes(optionLabel)
        ? prev.filter((option) => option !== optionLabel)
        : [...prev, optionLabel];
      setInputValue(newOptions.join(", "));
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

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newAiText = generateAIText(selectedOptions);
    setAiText(newAiText);
    setIsLoading(false);
  };

  const handleMoreClick = async () => {
    setIsGeneratingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newAdditionalInfo = generateAdditionalInfo(selectedOptions);
    setAdditionalInfoSections((prev) => [...prev, newAdditionalInfo]);
    setIsGeneratingMore(false);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="container mx-auto p-6 space-y-6 flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Enterprise Tech Stack Configurator
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 flex-grow">
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
                    Search and select technologies:
                  </Label>
                  <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                      <Input
                        id="options-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type to search or click buttons to select technologies"
                        className="pr-10"
                        aria-expanded={isDropdownOpen}
                        aria-autocomplete="list"
                        aria-controls="options-list"
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
                        {filteredOptions.length > 0 ? (
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
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            No technologies found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available technologies:
                  </Label>
                  {optionGroups.map((group) => (
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
                                selectedOptions.includes(option.label)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleOptionToggle(option.label)}
                              className="text-xs"
                              aria-pressed={selectedOptions.includes(
                                option.label
                              )}
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
                            aria-expanded={expandedGroups.includes(group.name)}
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
          <Card className="lg:w-1/2 shadow-lg flex flex-col h-[600px]">
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
                          Project Description:
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {aiText}
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
                            {info}
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
            <CardFooter className="border-t border-gray-200 dark:border-gray-700">
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
                    "More"
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
