import pdfToText from "@/app/utils/pdfToText";
import wordFileToText from "@/app/utils/wordFileToText";
import imageToText from "@/app/utils/imageToText";
import { readTextFile, SUPPORTED_MIME_TYPES } from "@/app/utils";

const fileHandlers = new Map<string, (file: File) => Promise<string>>([
  [SUPPORTED_MIME_TYPES.PDF, pdfToText],
  [SUPPORTED_MIME_TYPES.TEXT, readTextFile],
  [SUPPORTED_MIME_TYPES.WORD, wordFileToText],
  [SUPPORTED_MIME_TYPES.JPEG, imageToText],
  [SUPPORTED_MIME_TYPES.PNG, imageToText],
  [SUPPORTED_MIME_TYPES.SVG, imageToText],
]);

export const getCvText = async (file: File): Promise<string> => {
  const handler = fileHandlers.get(file.type);
  if (!handler) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  console.log(`${file.type} file detected`);
  return handler(file);
};
