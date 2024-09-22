"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import pdfToText from "../utils/pdfToText";
import wordToText from "../utils/wordToText";

const CvUploader = () => {
  const [cvText, setCvText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    // Access sessionStorage only after component has mounted
    const storedCvText = sessionStorage.getItem("cvText");
    if (storedCvText) {
      setCvText(storedCvText);
    }
  }, []);

  const fileIsSupported = (file: File) => {
    return (
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const handleUpload = () => {
    setError(null);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.txt";
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileName(file.name);
        if (!fileIsSupported(file)) {
          console.log("File is not supported");
          setError("File type not supported");
        }

        if (file.type === "application/pdf") {
          console.log("PDF file detected");
          setIsLoading(true);
          const text = await pdfToText(file);
          sessionStorage.setItem("cvText", text);
          setCvText(text);
        } else if (file.type === "text/plain") {
          console.log("Plain text file detected");
          setIsLoading(true);
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            sessionStorage.setItem("cvText", text);
            setCvText(text);
          };
          reader.readAsText(file);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          console.log("Word file detected");
          setIsLoading(true);
          const text = await wordToText(file);
          sessionStorage.setItem("cvText", text);
          setCvText(text);
        }
        setIsLoading(false);
      }
    };
    fileInput.click();
  };

  const handleClear = () => {
    sessionStorage.removeItem("cvText");
    setCvText(null);
    setFileName(null);
  };

  return (
    <div>
      <div>CvUploader</div>
      <Button onClick={handleUpload} disabled={isLoading}>
        Upload CV
      </Button>
      <Button onClick={handleClear} disabled={isLoading}>
        Clear CV
      </Button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <p>{cvText && fileName ? `${fileName} loaded` : "No file loaded"}</p>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default CvUploader;
