"use server";
export const maxDuration = 30;


import { convertPdfToSvgs } from "./convertPdfToSvgs";
import { convertSvgsToText } from "./convertSvgsToText";

export const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  try {
    const imageBuffers = await convertPdfToSvgs(pdfBuffer);
    const text = await convertSvgsToText(imageBuffers);
    return text;
  } catch (error) {
    console.error("Error during fallback OCR text extraction:", error);
    throw error;
  }
};
