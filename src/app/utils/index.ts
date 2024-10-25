export * from "./constants";
export * from "./pdfToText";
export * from "./wordFileToText";
export * from "./isReadableText";

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const isNewOption = (
  testOption: string,
  options: { id: string; label: string }[]
): boolean => {
  return !options.find((option) => option.label.toLowerCase() === testOption.toLowerCase());
};

export const fileIsSupported = (file: File) => {
  return (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
};
