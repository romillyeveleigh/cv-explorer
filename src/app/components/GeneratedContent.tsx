"use client";

import React, { useState, useRef, FC, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Anthropic from "@anthropic-ai/sdk";

import { generateFollowUpPrompt } from "../utils/promptUtils";
import { ContentBlock } from "@anthropic-ai/sdk/resources/messages.mjs";

interface GeneratedContentProps {
  isLoading: boolean;
  selectedOptions: string[];
  aiText: string;
  conversationMessages: {
    role: "user" | "assistant";
    content: string | ContentBlock[];
  }[];
  additionalInfoSections: string[];
  setAdditionalInfoSections: (additionalInfoSections: string[]) => void;
}

const GeneratedContent: FC<GeneratedContentProps> = ({
  isLoading,
  selectedOptions,
  aiText,
  conversationMessages,
  additionalInfoSections,
  setAdditionalInfoSections,
}) => {
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // const [aiText, setAiText] = useState("");
  // const [additionalInfoSections, setAdditionalInfoSections] = useState<
  //   string[]
  // >([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastAddedSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastAddedSectionRef.current) {
      lastAddedSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [additionalInfoSections]);

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

  return (
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
                ))}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Click "Generate Description" to create a project description
                based on your selected technologies.
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
  );
};

export default GeneratedContent;
