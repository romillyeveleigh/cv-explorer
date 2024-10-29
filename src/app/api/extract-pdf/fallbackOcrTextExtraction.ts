"use server";

import { convertPdfToSvgs } from "./convertPdfToSvgs";
import { convertSvgsToText } from "./convertSvgsToText";

export const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  const imageBuffers = await convertPdfToSvgs(pdfBuffer);
  const text = await convertSvgsToText(imageBuffers);
  return text;
};
