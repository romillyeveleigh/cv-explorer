"use server";

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  const pdf2img = await import("pdf-img-convert");
  // Convert PDF to images with optimized settings
  const imageBuffers = await pdf2img.convert(pdfBuffer, {
    base64: false,
    scale: 2,
    width: 1500, // Set a fixed width for consistency and potential speed improvement
  });

  return imageBuffers;
};
