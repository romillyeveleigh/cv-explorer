"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";
import { fileIsSupported, SKILL_GROUPS } from "@/app/utils";
import { Insight, SkillGroup } from "@/app/utils/types";
import pdfToText from "@/app/utils/pdfToText";
import wordToText from "@/app/utils/wordToText";
import {
  createRequestMessage,
  generateResponse,
  getMessageFromPrompt,
  Model,
} from "@/app/hooks/useMessageThread";

export default function CVExplorer() {
  const [file, setFile] = useState<File | null>(null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // setFile(file);
      setFileName(file.name);
      if (!fileIsSupported(file)) {
        console.log("File is not supported");
        setError("File type not supported");
      }

      const getNewSkillGroups = async (text: string) => {
        const prompt = `give me a list of skills extracted from this CV text: ${text}
        The list should be in the following format:
        - Skill 1
        - Skill 2
        - Skill 3
        Give me the main 10 skills`;
        const message = await getMessageFromPrompt(prompt, Model.HAIKU, 0.5);

        const newSkillGroups: SkillGroup[] = [];
        return newSkillGroups;
      };

      const handleCvAnalysis = async (text: string) => {
        const newSkillGroups = await getNewSkillGroups(text);
        setSkillGroups(newSkillGroups);
      };

      const getCvText = async () => {
        if (file.type === "application/pdf") {
          console.log("PDF file detected");
          setIsLoading(true);
          const text = await pdfToText(file);
          return text;
        } else if (file.type === "text/plain") {
          console.log("Plain text file detected");
          setIsLoading(true);
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            return text;
          };
          reader.readAsText(file);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          console.log("Word file detected");
          setIsLoading(true);
          const text = await wordToText(file);
          return text;
        }
      };

      setIsLoading(true);
      getCvText().then((text: string) => {
        console.log("CV text:", text.slice(0, 100));
        setCvText(text);
        handleCvAnalysis(text);
      });
      setIsLoading(false);

      // const handleCvAnalysis = async () => {
      //   // Simulate CV analysis
      //   const newSkillGroups = await getNewSkillGroups(content);
      //   setSkillGroups(newSkillGroups);
      // };
      // handleCvAnalysis();
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
        <Card className="lg:h-[calc(90vh-2rem)] flex flex-col">
          <CvAnalysis
            fileName={fileName}
            skillGroups={skillGroups}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            handleFileUpload={handleFileUpload}
            generateInsight={generateInsight}
            isGeneratingInitialInsight={isGeneratingInitialInsight}
            reset={reset}
          />
        </Card>

        <Card className="lg:h-[calc(90vh-2rem)] flex flex-col">
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
