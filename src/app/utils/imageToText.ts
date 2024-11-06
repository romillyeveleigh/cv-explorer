"use client";

const imageTypeIndex = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
};

const imageToText = async (file: File) => {
  const imageType = imageTypeIndex[file.type as keyof typeof imageTypeIndex];

  if (!imageType) {
    throw new Error("Unsupported image type");
  }

  const formData = new FormData();
  formData.append(imageType, file);

  try {
    const response = await fetch("/api/extract-image", {
      method: "POST",
      body: formData,
      headers: {
        "image-type": imageType,
      },
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
