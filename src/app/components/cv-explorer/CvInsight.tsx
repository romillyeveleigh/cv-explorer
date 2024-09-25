import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, InfoIcon } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import WordFadeIn from "@/components/magicui/word-fade-in";

type Insight = {
  content: string;
  step: number;
};

type CvInsightProps = {
  isGeneratingInitialInsight: boolean;
  insights: Insight[];
  headline: string;
  isFirstInsightGenerated: boolean;
  setInsights: React.Dispatch<React.SetStateAction<Insight[]>>;
};

export default function CvInsight({
  isGeneratingInitialInsight,
  insights,
  headline,
  isFirstInsightGenerated,
  setInsights,
}: CvInsightProps) {
  const insightContentRef = useRef<HTMLDivElement>(null);
  const [isLoadingMoreInsights, setIsLoadingMoreInsights] = useState(false);
  const [showHeadline, setShowHeadline] = useState(true);

  useEffect(() => {
    if (insightContentRef.current) {
      insightContentRef.current.scrollTo({
        top: insightContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [insights]);

  const handleShowMore = () => {
    setIsLoadingMoreInsights(true);
    setTimeout(() => {
      const newInsights = [
        "Additionally, the candidate shows potential for leadership roles, given their experience in team management and Scrum practices. Their diverse skill set suggests they could be a valuable asset in cross-functional teams, bridging the gap between technical and managerial roles.",
        "The CV indicates a strong foundation in both front-end and back-end technologies, making the candidate suitable for full-stack development positions. Their experience with TypeScript suggests an attention to code quality and type safety.",
        "With skills in machine learning and data analysis, the candidate could contribute to data-driven decision-making processes. This combination of technical and analytical skills is highly valued in today's data-centric business environment.",
        "The candidate's proficiency in SQL, coupled with their data analysis skills, indicates they could excel in roles involving database management and data warehousing. This skill set is crucial for maintaining and optimizing data infrastructure.",
        "Given their diverse skill set, the candidate appears well-suited for roles in tech consulting or as a technical product manager. Their ability to understand both technical and business aspects could be invaluable in translating between technical and non-technical stakeholders.",
      ];
      const nextStep = insights.length + 1;
      const newInsight = {
        content: newInsights[(nextStep - 2) % newInsights.length],
        step: nextStep,
      };
      setInsights([...insights, newInsight]);
      setIsLoadingMoreInsights(false);
    }, 1500);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-left">CV Insight</CardTitle>
        <div className="flex items-center">
          <Checkbox
            checked={showHeadline}
            onCheckedChange={(checked) => setShowHeadline(checked)}
            id="toggle-headline"
          />
          <label htmlFor="toggle-headline" className="ml-2 text-sm">
            Show Headline
          </label>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden p-4">
        {isGeneratingInitialInsight ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Analyzing CV superpowers...
            </p>
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-muted p-4 rounded-lg flex items-start space-x-4">
            <InfoIcon className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Welcome to the CV Explorer
              </h3>
              <p className="text-muted-foreground">
                This is a demo insight based on Romilly's default CV. Select
                skills to generate a personalized insight based on the CV
                content and your selected skills.
              </p>
            </div>
          </div>
        ) : (
          <>
            {showHeadline && headline && (
              <div className="mt-4 ml-6 mr-6">
                <WordFadeIn words={headline} />
              </div>
            )}
            <div
              ref={insightContentRef}
              className="flex-grow overflow-y-auto mb-4 mt-4 pr-4"
            >
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border"></div>
                {insights.map((insight, index) => (
                  <div key={index} className="mb-4 last:mb-0 relative pl-6">
                    {index > 0 && (
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-gray-300 bg-background"></div>
                    )}
                    <p className="whitespace-pre-line">{insight.content}</p>
                  </div>
                ))}
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
