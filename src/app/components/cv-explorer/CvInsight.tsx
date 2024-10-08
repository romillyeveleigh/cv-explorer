import React, { useRef, useEffect, useState, FC } from "react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, InfoIcon } from "lucide-react";
import WordFadeIn from "@/components/magicui/word-fade-in";
import { MarkdownToJsx } from "../MarkdownToJsx";

type Insight = {
  insight: string;
  step: number;
};

type CvInsightProps = {
  isGeneratingInitialInsight: boolean;
  headline: string;
  memo: string;
  insights: Insight[];
  isFirstInsightGenerated: boolean;
  handleShowMore: () => void;
  isLoadingMoreInsights: boolean;
  name: string;
};

export default function CvInsight({
  isGeneratingInitialInsight,
  headline,
  memo,
  insights,
  isFirstInsightGenerated,
  isLoadingMoreInsights,
  handleShowMore,
  name,
}: CvInsightProps) {
  const insightContentRef = useRef<HTMLDivElement>(null);
  const [showHeadline, setShowHeadline] = useState(true);

  useEffect(() => {
    if (insightContentRef.current) {
      insightContentRef.current.scrollTo({
        top: insightContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [insights]);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-left">CV Insight</CardTitle>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={showHeadline}
            onCheckedChange={(checked) => setShowHeadline(Boolean(checked))}
            id="toggle-headline"
          />
          <label htmlFor="toggle-headline" className="ml-2 text-sm">
            Show Headline
          </label>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden pt-6">
        {isGeneratingInitialInsight ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Analyzing CV superpowers...
            </p>
          </div>
        ) : !memo ? (
          <div className="bg-muted p-4 rounded-lg flex items-start space-x-4">
            <InfoIcon className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Welcome to the CV Explorer
              </h3>
              <p className="text-muted-foreground">
                This is a demo insight based on {name}&apos;s default CV. Select
                skills to generate a personalized insight based on the CV
                content and your selected skills.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={insightContentRef}
              className="flex-grow overflow-y-auto mb-4 mt-4 pr-4"
            >
              {showHeadline && headline && (
                <div className="ml-6 mr-6 mb-4">
                  <WordFadeIn words={headline} />
                </div>
              )}

              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border"></div>
                {[{ insight: memo, step: 0 }, ...insights].map(
                  ({ insight, step }, index) => (
                    <div key={index} className="mb-4 last:mb-0 relative pl-6">
                      {index > 0 && (
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-gray-300 bg-background"></div>
                      )}

                      <MarkdownToJsx markdown={insight} />
                      <p className="whitespace-pre-line"></p>
                    </div>
                  )
                )}
              </div>
            </div>
            {isFirstInsightGenerated && (
              <Button
                onClick={handleShowMore}
                variant="outline"
                className="w-full"
                disabled={isLoadingMoreInsights}
              >
                {isLoadingMoreInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "More Insights"
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </>
  );
}
