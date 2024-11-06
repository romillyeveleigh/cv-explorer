"use client";

const imageToText = async (file: File) => {
  const imageType = file.type === "image/jpeg" ? "jpg" : "png";

  const formData = new FormData();
  formData.append(imageType, file);

  try {
    const response = await fetch("/api/extract-image", {
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
    console.error("Error extracting image text:", error);
    throw error;
  }
};

export default imageToText;
