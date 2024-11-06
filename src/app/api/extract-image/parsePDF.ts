"use server";

export const parsePdf = async (pdfBuffer: Buffer) => {
  const pdf = require("pdf-parse/lib/pdf-parse");

  const data = await pdf(pdfBuffer);

  if (!data.text) {
    throw new Error("No text found in PDF");
  }

  return data.text;
};
