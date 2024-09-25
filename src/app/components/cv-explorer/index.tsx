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
        const prompt = `
        You are an expert in CV analysis and have hipster-level knowledge of trending technologies.
        You always pick newer technologies (for example, typescript over javascript, Next.js over react, aws over azure, etc.)
        and ignore out-dated or unimpressive technologies (for example, php, html, wordpress, etc.)
        You are looking for the most impressive technologies and skills that the candidate has to offer.

        You will be given a CV and asked to group the skills into categories.
        1) This is the text of the CV: 
        ===START OF TEXT===
        ${text}
        ===END OF TEXT===
        
        2) Decide on 3 most relevant categories that you would like to group the skills into in the response . 
        The last category should include mainly soft skills but don't name it "soft skills".

        3) In the response, isolate skills from the CV that are trending and would match the categories.
        If a skill is made by the same company as another skill, group them together in the format "Skill + Skill".
        Count this as 1 skill and do not repeat those skills individually in the response.
      
        4) Send the response in json format.
        The json should be an array of objects with the following structure:
        [{
          name: string; // The name of the skill category
          skills: string[]; 
        }]
        
        Your response should not contain any other text or formatting.
        The first 2 categories should have between 6 and 8 skills.
        The last category with mainly soft skills should have a maximum of 3 skills.
        No skills should be repeated across categories in the response.
       
        `;
        const message = await getMessageFromPrompt(prompt, Model.HAIKU, 0.8);
        console.log("🚀 ~ getNewSkillGroups ~ message:", message);
        const newSkillGroups: SkillGroup[] = JSON.parse(message);
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
