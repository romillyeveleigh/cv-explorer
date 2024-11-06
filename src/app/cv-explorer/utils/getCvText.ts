import pdfToText from "@/app/utils/pdfToText";
import wordFileToText from "@/app/utils/wordFileToText";
import imageToText from "@/app/utils/imageToText";

export const getCvText: (file: File) => Promise<string> = async (file) => {
  if (file.type === "application/pdf") {
    console.log("PDF file detected");
    return await pdfToText(file);
  } else if (file.type === "text/plain") {
    console.log("Plain text file detected");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error("Error reading plain text file"));
      };
      reader.readAsText(file);
    });
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("Word file detected");
    return await wordFileToText(file);
  } else if (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/svg+xml"
  ) {
    console.log("Image file detected");
    return await imageToText(file);
  }
};
