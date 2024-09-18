export * from "./constants";
export * from "./promptUtils";



export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const isNewOption = (
  testOption: string,
  options: { id: string; label: string }[]
): boolean => {
  return !options.find(
    (option) => option.label.toLowerCase() === testOption.toLowerCase()
  );
};
