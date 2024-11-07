import { SUPPORTED_MIME_TYPES } from "./constants";

export { pdfToText } from "./pdfToText";
export { wordFileToText } from "./wordFileToText";
export { isReadableText } from "./isReadableText";
export { readTextFile } from "./readTextFile";
export { imageToText } from "./imageToText";
export { getTextFromFile } from "./getTextFromFile";
export { getToolUseDataByToolName } from "./getToolUseData";

export const fileIsSupported = (file: File) => {
  return Object.values(SUPPORTED_MIME_TYPES).includes(file.type);
};
