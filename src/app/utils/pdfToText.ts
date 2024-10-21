"use client";

const pdfToText = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await fetch("/api/extract-pdf-v3", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.text) {
      throw new Error("No text extracted");
    }

    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw error;
  }
};

export default pdfToText;
