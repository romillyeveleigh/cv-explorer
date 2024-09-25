"use client";

const wordToText = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("word", file);

  try {
    const response = await fetch("/api/extract-word", {
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
    console.error("Error extracting Word text:", error);
    throw error;
  }
};

export default wordToText;
