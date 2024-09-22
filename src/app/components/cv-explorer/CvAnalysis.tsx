import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, FileText, RotateCcw, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { renderIcon } from "@/app/utils";

type SkillGroup = {
  name: string;
  skills: string[];
};

type CvAnalysisProps = {
  fileName: string;
  skillGroups: SkillGroup[];
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generateInsight: () => void;
  isGeneratingInitialInsight: boolean;
  reset: () => void;  
};

export default function CvAnalysis({
  fileName,
  skillGroups,
  selectedSkills,
  setSelectedSkills,
  handleFileUpload,
  generateInsight,
  isGeneratingInitialInsight,
  reset,
}: CvAnalysisProps) {
  const [searchSkill, setSearchSkill] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<SkillGroup[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFilteredGroups(filtered);
  }, [searchSkill, skillGroups, selectedSkills]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>CV Analysis</CardTitle>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
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
          </TooltipProvider>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
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
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-6 overflow-hidden pt-6">
        <div className="flex-grow flex flex-col min-h-0">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Search, select, or add new skills
          </p>
          <form onSubmit={handleSearchSkill} className="mb-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Search or enter a new skill"
              />
              <Button type="submit" disabled={!searchSkill}>Add</Button>
            </div>
          </form>
          <div className="overflow-y-auto flex-grow">
            <div className="space-y-4">
              {(searchSkill ? filteredGroups : skillGroups).map(
                (group, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">{group.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <Button
                          key={skill}
                          variant={
                            selectedSkills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleSkillSelect(skill)}
                        >
                          {renderIcon(skill)}
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Selected Skills</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Skills that will be used for CV analysis
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-sm cursor-pointer"
                  onClick={() => handleSkillSelect(skill)}
                >
                  {skill} ✕
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={generateInsight}
            disabled={selectedSkills.length === 0 || isGeneratingInitialInsight}
            className="flex-grow"
          >
            {isGeneratingInitialInsight ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Brewing insights...
              </>
            ) : (
              "Generate Insight"
            )}
          </Button>
          <TooltipProvider>
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
          </TooltipProvider>
        </div>
      </CardContent>
    </>
  );
}
