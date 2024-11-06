
import { convertSvgsToText } from "./convertSvgsToText";

export const ocrTextExtraction = async (imageBuffer: Buffer) => {
  try {
    const text = await convertSvgsToText([imageBuffer]);
    return text;
  } catch (error) {
    console.error("Error during fallback OCR text extraction:", error);
    throw error;
  }
};
