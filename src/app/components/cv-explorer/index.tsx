"use client";

import React, { useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { DEFAULT_CV_TEXT, DEFAULT_SKILL_GROUPS, fileIsSupported } from "@/app/utils";
import { SkillGroup, Model } from "@/app/utils/types";
import { useClaudeConversation } from "@/app/hooks";

import { getToolUseDataByToolName, getCvText } from "./utils";
import {
  skillGroupGenerator,
  initialMemoGenerator,
  insightGenerator,
  InsightGeneratorResponse,
  InitialMemoGeneratorResponse,
  SkillGroupGeneratorResponse,
} from "@/app/utils/generators";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";

const DEFAULTS = {
  fileName: "Romilly_Eveleigh_CV.pdf",
  name: "Romilly Eveleigh",
  professionalTitle: "Full Stack Developer",
  skillGroups: DEFAULT_SKILL_GROUPS,
  selectedSkills: [],
  cvText: DEFAULT_CV_TEXT,
};

export default function CVExplorer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState(DEFAULTS.fileName);
  const [cvText, setCvText] = useState<string | null>(DEFAULTS.cvText);
  const [name, setName] = useState<string>(DEFAULTS.name);
  const [professionalTitle, setProfessionalTitle] = useState<string>(DEFAULTS.professionalTitle);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(DEFAULTS.skillGroups);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(DEFAULTS.selectedSkills);

  const [isLoadingCvText, setIsLoadingCvText] = useState(false);
  const [isGeneratingSkillGroups, setIsGeneratingSkillGroups] = useState(false);
  const [isGeneratingInitialMemo, setIsGeneratingInitialMemo] = useState(false);
  const [isLoadingMoreInsights, setIsLoadingMoreInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [headline, setHeadline] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const { messages, sendMessage, resetMessages } = useClaudeConversation();
  const insights = getToolUseDataByToolName<InsightGeneratorResponse>(
    messages,
    "insight-generator"
  );

  const onReset = () => {
    setFileName(DEFAULTS.fileName);
    setName(DEFAULTS.name);
    setProfessionalTitle(DEFAULTS.professionalTitle);
    setCvText(DEFAULTS.cvText);
    setSkillGroups(DEFAULTS.skillGroups);
    setSelectedSkills(DEFAULTS.selectedSkills);
    setMemo("");
    setHeadline("");
    resetMessages();
  };

  const handleGenerateSkillGroups = async (cvText: string) => {
    setIsGeneratingSkillGroups(true);
    const response = await sendMessage(
      cvText,
      {
        model: Model.HAIKU,
        temperature: 0.8,
        system: skillGroupGenerator.system,
        tools: skillGroupGenerator.tools,
        tool_choice: { type: "tool", name: skillGroupGenerator.tools[0].name },
      },
      true
    );

    if (response?.content[0].type !== "tool_use") {
      console.error("No tool use found in response");
      setIsGeneratingSkillGroups(false);
      throw new Error("No tool use found in response");
    }

    const { name, professionalTitle, skillGroups } = response.content[0]
      .input as SkillGroupGeneratorResponse;

    console.log("Recieved skill groups", response.content[0].input);

    if (
      typeof name !== "string" ||
      typeof professionalTitle !== "string" ||
      !Array.isArray(skillGroups) ||
      !skillGroups.every(
        (group) =>
          typeof group === "object" && typeof group.name === "string" && Array.isArray(group.skills)
      )
    ) {
      console.error("Invalid format for skill groups");
      setIsGeneratingSkillGroups(false);
      throw new Error("Invalid format for skill groups");
    }

    setName(name);
    setProfessionalTitle(professionalTitle);
    setSkillGroups(skillGroups);
    setIsGeneratingSkillGroups(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingCvText(true);

    const file = event.target.files?.[0];

    if (!file) {
      setIsLoadingCvText(false);
      return;
    }

    if (!fileIsSupported(file)) {
      console.log("File type is not supported");
      setError("File type not supported");
      setIsLoadingCvText(false);
      return;
    }

    try {
      const cvText = await getCvText(file);
      console.log("CV text sample:", `"${cvText.slice(0, 100)}..." `);

      await handleGenerateSkillGroups(cvText);

      setFileName(file.name);
      setCvText(cvText);
      setSelectedSkills([]);
    } catch (error) {
      console.error("Error generating skill groups:", error);
      setError("Error generating skill groups");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoadingCvText(false);
    }
  };

  const generateInitialMemo = async () => {
    if (!cvText) {
      setError("No CV text found");
      return;
    }

    setIsGeneratingInitialMemo(true);

    const content = `Focus on these skills: ${selectedSkills.join(", ")}
    Here is the CV: ${cvText}`;

    const response = await sendMessage(
      content,
      {
        model: Model.SONNET,
        temperature: 1,
        system: initialMemoGenerator.system,
        tools: initialMemoGenerator.tools,
        tool_choice: { type: "tool", name: initialMemoGenerator.tools[0].name },
      },
      true
    );

    if (response?.content[0].type !== "tool_use") {
      console.error("No tool use found in response");
      setIsGeneratingSkillGroups(false);
      throw new Error("No tool use found in response");
    }

    const { tagline: headline, memo } = response.content[0].input as InitialMemoGeneratorResponse;

    setHeadline(headline);
    setMemo(memo);
    setIsGeneratingInitialMemo(false);
  };

  const generateInsight = async () => {
    setIsLoadingMoreInsights(true);
    const content = `Show me more insights.`;
    await sendMessage(
      content,
      {
        model: Model.HAIKU,
        temperature: 0.8,
        tools: insightGenerator.tools,
        tool_choice: { type: "tool", name: insightGenerator.tools[0].name },
      },
      false
    );
    setIsLoadingMoreInsights(false);
  };

  const onClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90">
        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvAnalysis
            name={name}
            professionalTitle={professionalTitle}
            fileName={fileName}
            skillGroups={skillGroups}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            handleFileUpload={handleFileUpload}
            generateInitialMemo={generateInitialMemo}
            isGeneratingInitialMemo={isGeneratingInitialMemo}
            isLoading={
              isGeneratingSkillGroups ? "skill-groups" : isLoadingCvText ? "cv-text" : false
            }
            error={error}
            reset={onReset}
            onClickUpload={onClickUpload}
            fileInputRef={fileInputRef}
          />
        </Card>

        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CvInsight
            isGeneratingInitialInsight={isGeneratingInitialMemo}
            headline={headline}
            memo={memo}
            insights={insights}
            isFirstInsightGenerated={Boolean(memo && headline)}
            handleShowMore={generateInsight}
            isLoadingMoreInsights={isLoadingMoreInsights}
            name={name}
            onClickUpload={onClickUpload}
          />
        </Card>
      </div>
    </div>
  );
}
