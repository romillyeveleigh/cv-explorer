"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";
import {
  fileIsSupported,
  getSkillGroupsPrompt,
  SKILL_GROUPS,
} from "@/app/utils";
import { Insight, SkillGroup } from "@/app/utils/types";
import pdfToText from "@/app/utils/pdfToText";
import wordToText from "@/app/utils/wordToText";
import { getMessageFromPrompt, Model } from "@/app/hooks/useMessageThread";

export default function CVExplorer() {
  const [fileName, setFileName] = useState("Romilly_Eveleigh_CV.pdf");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [headline, setHeadline] = useState<string>("");
  const [isGeneratingInitialInsight, setIsGeneratingInitialInsight] =
    useState(false);
  const [isFirstInsightGenerated, setIsFirstInsightGenerated] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);

  useEffect(() => {
    // Preload default data
    const initialSkillGroups: SkillGroup[] = SKILL_GROUPS;
    setSkillGroups(initialSkillGroups);
  }, []);

  const getNewSkillGroups = async (text: string) => {
    const message = await getMessageFromPrompt(
      getSkillGroupsPrompt(text),
      Model.HAIKU,
      0.8
    );
    return JSON.parse(message) as SkillGroup[];
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

  const generateInsight = () => {
    setIsGeneratingInitialInsight(true);
    // Simulate insight generation
    setTimeout(() => {
      const newInsight = {
        content: `Based on the selected skills (${selectedSkills.join(
          ", "
        )}), the CV shows strong proficiency in web development and data science. 
        The candidate has experience with modern JavaScript frameworks and Python-based data analysis tools. 
        They also demonstrate project management skills, particularly in Agile methodologies.`,
        step: 1,
      };
      setInsights([newInsight]);
      setHeadline(
        "Versatile Tech Professional with Full-Stack and Data Science Expertise"
      );
      setIsGeneratingInitialInsight(false);
      setIsFirstInsightGenerated(true);
    }, 2000);
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
            headline={headline}
            isFirstInsightGenerated={isFirstInsightGenerated}
            setInsights={setInsights}
          />
        </Card>
      </div>
    </div>
  );
}
