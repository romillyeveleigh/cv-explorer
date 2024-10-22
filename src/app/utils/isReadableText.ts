export function isReadableText(text: string, threshold: number = 0.7): boolean {
  // Remove whitespace and newlines
  const cleanedText = text.replace(/\s+/g, "");

  if (cleanedText.length === 0) {
    return false;
  }

  // Count alphanumeric characters
  const alphanumericCount = cleanedText
    .split("")
    .filter((char) => /[a-zA-Z0-9]/.test(char)).length;

  // Calculate the ratio of alphanumeric characters to total characters
  const ratio = alphanumericCount / cleanedText.length;

  // Check if the ratio is above the threshold
  return ratio > threshold;
}
