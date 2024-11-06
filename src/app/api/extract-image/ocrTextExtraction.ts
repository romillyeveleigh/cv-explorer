
import { convertImagesToText } from "./convertImagesToText";

export const ocrTextExtraction = async (imageBuffer: Buffer) => {
  try {
    const text = await convertImagesToText([imageBuffer]);
    return text;
  } catch (error) {
    console.error("Error during fallback OCR text extraction:", error);
    throw error;
  }
};
