import pdfToText from "./pdfToText";
import wordFileToText from "./wordFileToText";
export * from "./isReadableText";
export * from "./readTextFile";

export { pdfToText, wordFileToText };

export const SUPPORTED_MIME_TYPES = {
  PDF: "application/pdf",
  TEXT: "text/plain",
  WORD: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  JPEG: "image/jpeg",
  PNG: "image/png",
  SVG: "image/svg+xml",
};

export const fileIsSupported = (file: File) => {
  return Object.values(SUPPORTED_MIME_TYPES).includes(file.type);
};
