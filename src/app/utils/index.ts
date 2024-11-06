import pdfToText from "./pdfToText";
import wordFileToText from "./wordFileToText";
export * from "./isReadableText";

export { pdfToText, wordFileToText };

export const fileIsSupported = (file: File) => {
  return (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "image/jpeg" ||
    file.type === "image/png"
  );
};
