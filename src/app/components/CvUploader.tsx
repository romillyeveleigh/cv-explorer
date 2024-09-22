"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const CvUploader = () => {
  const [cvText, setCvText] = useState<string | null>(
    localStorage.getItem("cvText")
  );

  const cvIsSet = cvText && cvText.length > 0;


  const formatText = async (text: string) => {
    const formattedText = await pdfToText(text);
    return formattedText;
  };

  const handleUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.txt";
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          // format text from pdf
          const formattedText = await formatText(text);
          localStorage.setItem("cvText", formattedText);
          setCvText(formattedText);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  const handleClear = () => {
    localStorage.removeItem("cvText");
    setCvText(null);
  };

  return (
    <div>
      <div>CvUploader</div>
      {cvIsSet ? <div>Cv is set</div> : <div>Cv is not set</div>}
      <Button onClick={handleUpload}>Upload CV</Button>
      <Button onClick={handleClear}>Clear CV</Button>
      <p>{cvText}</p>
    </div>
  );
};

export default CvUploader;
