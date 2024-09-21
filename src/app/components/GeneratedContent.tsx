"use client";

import React, { useState, useRef, FC, useEffect, useMemo } from "react";
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

import { generateFollowUpPrompt } from "../utils/promptUtils";

interface GeneratedContentProps {
  isLoading: boolean;
  selectedOptions: string[];
  responses: string[];
  updateThread: (prompt: string, isNewThread: boolean) => Promise<void>;
}

const GeneratedContent: FC<GeneratedContentProps> = ({
  isLoading,
  selectedOptions,
  responses,
  updateThread,
}) => {
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastAddedSectionRef = useRef<HTMLDivElement>(null);

  const firstResponse = responses[0];
  const additionalInfoSections = useMemo(
    () => (responses.length > 1 ? responses.slice(1) : []),
    [responses]
  );

  useEffect(() => {
    if (lastAddedSectionRef.current) {
      lastAddedSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [additionalInfoSections]);

  const handleMoreClick = async () => {
    setIsGeneratingMore(true);
    try {
      const followUpPrompt = generateFollowUpPrompt(selectedOptions);
      await updateThread(followUpPrompt);
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
            ) : firstResponse ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {firstResponse.split("\n")[0].replace(/\*\*/g, "")}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {firstResponse
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
        {firstResponse && (
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
