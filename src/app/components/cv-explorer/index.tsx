"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";

type SkillGroup = {
  name: string;
  skills: string[];
};

type Insight = {
  content: string;
  step: number;
};

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

  useEffect(() => {
    // Preload demo data
    const initialSkillGroups: SkillGroup[] = [
      {
        name: "Web Development",
        skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
      },
      {
        name: "Data Science",
        skills: [
          "Python",
          "Data Analysis",
          "Machine Learning",
          "SQL",
          "Statistics",
        ],
      },
      {
        name: "Project Management",
        skills: [
          "Agile",
          "Scrum",
          "Kanban",
          "Risk Management",
          "Stakeholder Management",
        ],
      },
    ];
    setSkillGroups(initialSkillGroups);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      // Simulate CV analysis
      setTimeout(() => {
        const newSkillGroups: SkillGroup[] = [
          {
            name: "Web Development",
            skills: [
              "JavaScript",
              "React",
              "Node.js",
              "TypeScript",
              "Vue.js",
              "Angular",
            ],
          },
          {
            name: "Data Science",
            skills: [
              "Python",
              "Data Analysis",
              "Machine Learning",
              "SQL",
              "R",
              "TensorFlow",
            ],
          },
          {
            name: "Project Management",
            skills: [
              "Agile",
              "Scrum",
              "Kanban",
              "PRINCE2",
              "Six Sigma",
              "Team Leadership",
            ],
          },
          {
            name: "Cloud Technologies",
            skills: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
          },
        ];
        setSkillGroups(newSkillGroups);
      }, 1500);
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
