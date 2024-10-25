"use client";

import React, { useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { DEFAULT_CV_TEXT, fileIsSupported, SKILL_GROUPS } from "@/app/utils";
import { SkillGroup, Model } from "@/app/utils/types";
import { useClaudeConversation } from "@/app/hooks";

import {
  getToolUseDataFromMessages,
  SkillGroupGenerator,
  InitialMemoGenerator,
  InsightGenerator,
  getCvText,
  INSIGHT_GENERATOR_SCHEMA,
  INITIAL_MEMO_GENERATOR_SCHEMA,
  SKILL_GROUP_GENERATOR_SCHEMA,
  SKILL_GROUP_GENERATOR_SYSTEM_PROMPT,
  INSIGHT_GENERATOR_SYSTEM_PROMPT,
} from "./utils";
import CvAnalysis from "./CvAnalysis";
import CvInsight from "./CvInsight";

const DEFAULTS = {
  fileName: "Romilly_Eveleigh_CV.pdf",
  name: "Romilly Eveleigh",
  professionalTitle: "Full Stack Developer",
  skillGroups: SKILL_GROUPS,
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

  const { messages, sendMessage, reset: resetMessages } = useClaudeConversation();
  const insights = getToolUseDataFromMessages<InsightGenerator>(messages, "insight-generator");

  const handleGenerateSkillGroups = async (cvText: string) => {
    setIsGeneratingSkillGroups(true);
    const response = await sendMessage(
      cvText,
      {
        model: Model.HAIKU,
        temperature: 0.8,
        system: SKILL_GROUP_GENERATOR_SYSTEM_PROMPT,
        tools: [SKILL_GROUP_GENERATOR_SCHEMA],
        tool_choice: { type: "tool", name: "skill-group-generator" },
      },
      true
    );

    if (response?.content[0].type !== "tool_use") {
      console.error("No tool use found in response");
      setIsGeneratingSkillGroups(false);
      throw new Error("No tool use found in response");
    }

    const { name, professionalTitle, skillGroups } = response.content[0]
      .input as SkillGroupGenerator;

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
        system: INSIGHT_GENERATOR_SYSTEM_PROMPT,
        tools: [INITIAL_MEMO_GENERATOR_SCHEMA],

        tool_choice: { type: "tool", name: "initial-memo-generator" },
      },
      true
    );

    if (response?.content[0].type !== "tool_use") {
      console.error("No tool use found in response");
      setIsGeneratingSkillGroups(false);
      throw new Error("No tool use found in response");
    }

    const { tagline: headline, memo } = response.content[0].input as InitialMemoGenerator;

    setHeadline(headline);
    setMemo(memo);
    setIsGeneratingInitialMemo(false);
  };

  const handleShowMore = async () => {
    setIsLoadingMoreInsights(true);
    await sendMessage(
      "Show me more insights.",
      {
        model: Model.HAIKU,
        temperature: 0.8,
        tool_choice: { type: "tool", name: "insight-generator" },
        tools: [INSIGHT_GENERATOR_SCHEMA],
      },
      false
    );
    setIsLoadingMoreInsights(false);
  };

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
            generateInsight={generateInitialMemo}
            isGeneratingInitialInsight={isGeneratingInitialMemo}
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
            handleShowMore={handleShowMore}
            isLoadingMoreInsights={isLoadingMoreInsights}
            name={name}
            onClickUpload={onClickUpload}
          />
        </Card>
      </div>
    </div>
  );
}
