export * from "./pdfToText";
export * from "./wordFileToText";
export * from "./isReadableText";

export const fileIsSupported = (file: File) => {
  return (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
};
