"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import pdfToText from "../utils/pdfToText";

const CvUploader = () => {
  const [cvText, setCvText] = useState<string | null>(
    localStorage.getItem("cvText")
  );

  const cvIsSet = cvText && cvText.length > 0;

  const handleUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.txt";
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {

        if (file.type === "application/pdf") {
          console.log("PDF file detected");
          const text = await pdfToText(file);
          localStorage.setItem("cvText", text);
          setCvText(text);
        }

        if (file.type === "text/plain") {
          console.log("Plain text file detected");
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            localStorage.setItem("cvText", text);
            setCvText(text);
          };
          reader.readAsText(file);
        }
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
