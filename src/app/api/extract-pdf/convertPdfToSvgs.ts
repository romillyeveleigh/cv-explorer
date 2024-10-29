"use server";

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  try {
    await import('canvas');
    await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdf2img = await import("pdf-img-convert");
    // Convert PDF to images with optimized settings
    const imageBuffers = await pdf2img.convert(pdfBuffer, {
    base64: false,
    scale: 2,
    width: 1500, // Set a fixed width for consistency and potential speed improvement
  });

    return imageBuffers;
  } catch (error) {
    console.error("Error during PDF to SVG conversion:", error);
    throw error;
  }
};
