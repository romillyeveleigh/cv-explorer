import React, { useState, useEffect } from "react";
import { Upload, FileText, RotateCcw, Loader2, AlertTriangle } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeText } from "@/components/ui/fade-text";

import { SimpleIcon } from "../components/SimpleIcon";

const MAX_SELECTED_SKILLS_TO_SHOW = 3;

type SkillGroup = {
  name: string;
  skills: string[];
};

const HeaderAndSubtitle = ({ header, subtitle }: { header: string; subtitle?: string }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{header}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>}
    </>
  );
};

type CvAnalysisProps = {
  fileName: string;
  skillGroups: SkillGroup[];
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  generateInitialMemo: () => void;
  isGeneratingInitialMemo: boolean;
  isLoading: string | boolean;
  error: string | null;
  reset: () => void;
  name: string;
  professionalTitle: string;
  onClickUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export default function CvAnalysis({
  fileName,
  skillGroups,
  selectedSkills,
  setSelectedSkills,
  handleFileUpload,
  generateInitialMemo,
  isGeneratingInitialMemo,
  isLoading,
  error,
  reset,
  name,
  professionalTitle,
  onClickUpload,
  fileInputRef,
}: CvAnalysisProps) {
  const [searchSkill, setSearchSkill] = useState("");
  const [filteredSkillGroups, setFilteredSkillGroups] = useState<SkillGroup[]>([]);

  useEffect(() => {
    const filtered = skillGroups
      .map((group) => ({
        ...group,
        skills: group.skills.filter(
          (skill) =>
            skill.toLowerCase().includes(searchSkill.toLowerCase()) &&
            !selectedSkills.includes(skill)
        ),
      }))
      .filter((group) => group.skills.length > 0);
    setFilteredSkillGroups(filtered);
  }, [searchSkill, skillGroups, selectedSkills]);

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSearchSkill("");
  };

  const handleSearchSkill = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      searchSkill &&
      !selectedSkills.includes(searchSkill) &&
      !skillGroups.some((group) => group.skills.includes(searchSkill))
    ) {
      setSelectedSkills([...selectedSkills, searchSkill]);
      setSearchSkill("");
    }
  };

  const handleReset = () => {
    setSearchSkill("");
    reset();
  };

  const skillGroupsSection = (searchSkill ? filteredSkillGroups : skillGroups).map(
    (group, index) => (
      <div key={index}>
        <h3 className="font-semibold mb-2">{group.name}</h3>
        <div className="flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <Button
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSkillSelect(skill)}
            >
              <SimpleIcon slug={skill} />
              <span className="max-w-[180px] overflow-hidden text-ellipsis">{skill}</span>
            </Button>
          ))}
        </div>
      </div>
    )
  );

  const selectedSkillsSection = selectedSkills.length > 0 && (
    <>
      <HeaderAndSubtitle
        header="Selected Skills"
        subtitle="Skills that will be used for CV analysis"
      />
      <div className="flex flex-wrap gap-2">
        {selectedSkills.slice(0, MAX_SELECTED_SKILLS_TO_SHOW).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-sm cursor-pointer"
            onClick={() => handleSkillSelect(skill)}
          >
            {skill} ✕
          </Badge>
        ))}
        {selectedSkills.length > MAX_SELECTED_SKILLS_TO_SHOW && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Badge variant="secondary" className="text-sm cursor-pointer">
                  + {selectedSkills.length - MAX_SELECTED_SKILLS_TO_SHOW} more
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col">
                {selectedSkills.slice(MAX_SELECTED_SKILLS_TO_SHOW).map((skill) => (
                  <Button
                    key={skill}
                    variant="secondary"
                    className="text-sm mb-1"
                    onClick={() => handleSkillSelect(skill)} // Deselect skill on click
                  >
                    {skill} ✕
                  </Button>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </>
  );

  const loadedContent = (
    <>
      <div className="flex flex-row gap-2 items-baseline">
        <FadeText text={`${name}`} className="font-bold text-xl truncate" />
        <FadeText text={`${professionalTitle}`} className="text-muted-foreground text-sm" />
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <HeaderAndSubtitle header="Skills" subtitle="Search, select, or add new skills" />
        <form onSubmit={handleSearchSkill} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              placeholder="Search or enter a new skill"
            />
            <Button type="submit" disabled={!searchSkill}>
              Add
            </Button>
          </div>
        </form>

        <div className="overflow-y-auto flex-grow">
          <div className="space-y-4">{skillGroupsSection}</div>
        </div>
      </div>
      <div>{selectedSkillsSection}</div>
    </>
  );

  const ctaRow = (
    <>
      <div className="flex gap-2">
        <Button
          onClick={generateInitialMemo}
          disabled={selectedSkills.length === 0 || isGeneratingInitialMemo}
          className="flex-grow"
        >
          {isGeneratingInitialMemo ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Brewing insights...
            </>
          ) : (
            "Generate Insight"
          )}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={selectedSkills.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset selected skills</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );

  return (
    <TooltipProvider>
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 ">
        <CardTitle className="whitespace-nowrap flex-grow flex sm:items-center">
          CV Analysis
        </CardTitle>

        <div className="flex items-center flex-wrap justify-end gap-2 flex-grow-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{fileName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current CV: {fileName}</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            onClick={onClickUpload}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Change CV
          </Button>
        </div>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          className="hidden"
        />
      </CardHeader>

      <CardContent className="flex-grow flex flex-col space-y-6 overflow-hidden pt-4">
        {error || isLoading ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            {error && (
              <>
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium text-muted-foreground text-center">
                  Uh oh! {error} <br />
                  Please try again
                </p>
              </>
            )}
            {isLoading && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {isLoading === "cv-text"
                    ? "Extracting skills and experiences..."
                    : isLoading === "skill-groups"
                    ? "Unpacking career insights..."
                    : "Working on it..."}
                </p>
              </>
            )}
          </div>
        ) : (
          loadedContent
        )}
        {ctaRow}
      </CardContent>
    </TooltipProvider>
  );
}
