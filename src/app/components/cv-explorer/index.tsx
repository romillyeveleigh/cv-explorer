"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { jsonrepair } from "jsonrepair";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";
import {
  fileIsSupported,
  generateInitialInsightPrompt,
  getSkillGroupsPrompt,
  getSkillGroupsPromptV2,
  SKILL_GROUPS,
} from "@/app/utils";
import { Insight, SkillGroup } from "@/app/utils/types";
import pdfToText from "@/app/utils/pdfToText";
import wordToText from "@/app/utils/wordToText";
import {
  getMessageFromPrompt,
  getObjectFromPrompt,
  Model,
} from "@/app/hooks/useMessageThread";

const isValidJSON = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

export default function CVExplorer() {
  const [fileName, setFileName] = useState("Romilly_Eveleigh_CV.pdf");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [headline, setHeadline] = useState<string>("");
  const [isGeneratingInitialInsight, setIsGeneratingInitialInsight] =
    useState(false);
  const [isFirstInsightGenerated, setIsFirstInsightGenerated] = useState(false);
  const [isLoadingMoreInsights, setIsLoadingMoreInsights] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);

  useEffect(() => {
    // Preload default data
    const initialSkillGroups: SkillGroup[] = SKILL_GROUPS;
    setSkillGroups(initialSkillGroups);
  }, []);

  const getNewSkillGroups = async (text: string) => {
    const {
      system,
      tools = [],
      tool_choice,
      prompt,
    } = getSkillGroupsPromptV2(text);
    const response = await getObjectFromPrompt(prompt, {
      model: Model.HAIKU,
      temperature: 0.8,
      system,
      tools,
      tool_choice,
    });

    console.log("🚀 ~ getNewSkillGroups ~ response:", response);

    return response.categories as SkillGroup[];
  };

  const getCvText: (file: File) => Promise<string> = async (file) => {
    if (file.type === "application/pdf") {
      console.log("PDF file detected");
      return await pdfToText(file);
    } else if (file.type === "text/plain") {
      console.log("Plain text file detected");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          resolve(text);
        };
        reader.onerror = () => {
          reject(new Error("Error reading plain text file"));
        };
        reader.readAsText(file);
      });
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("Word file detected");
      return await wordToText(file);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!fileIsSupported(file)) {
      console.log("File is not supported");
      setError("File type not supported");
    }
    try {
      setIsLoading(true);
      const cvText = await getCvText(file);
      console.log("CV text:", cvText.slice(0, 100));
      const newSkillGroups = await getNewSkillGroups(cvText);
      // throw new Error("Test error");
      setFileName(file.name);
      setCvText(cvText);
      setSkillGroups(newSkillGroups);
      setSelectedSkills([]);
    } catch (error) {
      console.error("Error generating skill groups:", error);
      setError("Error generating skill groups");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // const getInitialInsightPrompt = (cvText: string) => {
  //   return `Generate an initial insight from the CV text: ${cvText} using the following skill groups: ${JSON.stringify(
  //     skillGroups
  //   )}`;
  // };

  const generateInsight = async () => {
    if (!cvText) {
      setError("No CV text found");
      return;
    }
    setIsGeneratingInitialInsight(true);
    // Simulate insight generation
    // setTimeout(() => {
    // const newInsight = {
    //   content: `Based on the selected skills (${selectedSkills.join(
    //     ", "
    //   )}), the CV shows strong proficiency in web development and data science.
    //   The candidate has experience with modern JavaScript frameworks and Python-based data analysis tools.
    //   They also demonstrate project management skills, particularly in Agile methodologies.`,
    //   step: 1,
    // };

    const newInsight = await getMessageFromPrompt(
      generateInitialInsightPrompt(cvText, selectedSkills),
      {
        model: Model.HAIKU,
        temperature: 0.8,
      }
    );

    const repairedInsight = jsonrepair(newInsight);
    const memo = JSON.parse(repairedInsight).memo;
    const tagline = JSON.parse(repairedInsight).tagline;

    setInsights([{ content: memo, step: 1, headline: tagline }]);
    setHeadline(
      "Versatile Tech Professional with Full-Stack and Data Science Expertise"
    );
    setIsGeneratingInitialInsight(false);
    setIsFirstInsightGenerated(true);
    // }, 2000);
  };

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

  const reset = () => {
    setSelectedSkills([]);
    setInsights([]);
    setHeadline("");
    setIsGeneratingInitialInsight(false);
    setIsFirstInsightGenerated(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90">
        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvAnalysis
            fileName={fileName}
            skillGroups={skillGroups}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            handleFileUpload={handleFileUpload}
            generateInsight={generateInsight}
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            isLoading={isLoading}
            error={error}
            reset={reset}
          />
        </Card>

        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvInsight
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            insights={insights}
            headline={insights[0]?.headline ?? ""}
            isFirstInsightGenerated={isFirstInsightGenerated}
            setInsights={setInsights}
            handleShowMore={handleShowMore}
            isLoadingMoreInsights={isLoadingMoreInsights}
          />
        </Card>
      </div>
    </div>
  );
}
